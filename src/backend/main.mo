import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Stripe "stripe/stripe";
import AccessControl "authorization/access-control";
import Text "mo:core/Text";
import OutCall "http-outcalls/outcall";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    email : Text;
  };

  public type Order = {
    id : Text;
    customerName : Text;
    customerEmail : Text;
    phone : Text;
    address : Text;
    phoneModel : Text;
    color : Text;
    texture : Text;
    pattern : Text;
    vibe : ?Text;
    aiSuggestionUsed : Bool;
    totalPrice : Nat;
    status : Text; // "pending", "confirmed", "shipped", "delivered"
    createdAt : Time.Time;
    createdBy : Principal; // Track who created the order
  };

  public type VibeDesign = {
    id : Text;
    vibe : Text; // "Gaming", "Music", "Minimalist", "Bold", "Nature", "Festival", "Athletic", "Creative"
    name : Text;
    color : Text;
    texture : Text;
    pattern : Text;
    description : Text;
    trending : Bool;
  };

  // Persistent storage
  let orders = Map.empty<Text, Order>();
  let vibes = Map.empty<Text, VibeDesign>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var orderIdCounter = 1;

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Calculate dynamic price
  func calculatePrice(texture : Text, pattern : Text) : Nat {
    var price = 2999;
    if (not Text.equal(texture, "")) { price += 500 };
    if (not Text.equal(pattern, "")) { price += 300 };
    price;
  };

  // Public function - accessible to all including guests (e-commerce checkout)
  public shared ({ caller }) func createOrder(
    customerName : Text,
    customerEmail : Text,
    phone : Text,
    address : Text,
    phoneModel : Text,
    color : Text,
    texture : Text,
    pattern : Text,
    vibe : ?Text,
    aiSuggestionUsed : Bool
  ) : async Order {
    let id = "EC" # orderIdCounter.toText();
    orderIdCounter += 1;
    let totalPrice = calculatePrice(texture, pattern);
    let order : Order = {
      id;
      customerName;
      customerEmail;
      phone;
      address;
      phoneModel;
      color;
      texture;
      pattern;
      vibe;
      aiSuggestionUsed;
      totalPrice;
      status = "pending";
      createdAt = Time.now();
      createdBy = caller;
    };
    orders.add(id, order);
    order;
  };

  // Restricted: Only order owner or admin can view
  public query ({ caller }) func getOrder(id : Text) : async Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) {
        // Allow access if caller is the order creator OR an admin
        if (order.createdBy != caller and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Can only view your own orders");
        };
        order;
      };
    };
  };

  // Admin only
  public query ({ caller }) func getAllOrders() : async [Order] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can access all orders");
    };
    orders.values().toArray();
  };

  func getOrderSafe(id : Text) : Order {
    switch (orders.get(id)) {
      case (null) { Runtime.trap("Order not found") };
      case (?order) { order };
    };
  };

  // Admin only
  public shared ({ caller }) func updateOrderStatus(id : Text, newStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update order status");
    };

    let existingOrder = getOrderSafe(id);
    let updatedOrder : Order = {
      existingOrder with
      status = newStatus;
    };

    orders.add(id, updatedOrder);
  };

  // Admin only
  public shared ({ caller }) func seedVibes() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can seed vibe designs");
    };

    let defaultVibes : [VibeDesign] = [
      {
        id = "vibe1";
        vibe = "Gaming";
        name = "Pixel Power";
        color = "Red";
        texture = "Glossy";
        pattern = "Pixel";
        description = "For gaming enthusiasts";
        trending = true;
      },
      {
        id = "vibe2";
        vibe = "Music";
        name = "Rhythmic Waves";
        color = "Blue";
        texture = "Matte";
        pattern = "Wave";
        description = "Inspired by music rhythms";
        trending = false;
      },
      // Add more default vibes as needed
    ];

    for (vibe in defaultVibes.values()) {
      vibes.add(vibe.id, vibe);
    };
  };

  // Public function - accessible to all (catalog browsing)
  public query func getVibesByType(vibeType : Text) : async [VibeDesign] {
    let filteredVibes = vibes.values().toArray().filter(
      func(v) {
        Text.equal(v.vibe, vibeType);
      }
    );
    let count = if (filteredVibes.size() > 5) { 5 } else {
      filteredVibes.size();
    };
    filteredVibes.sliceToArray(0, count);
  };

  // Stripe payment integration
  var stripeConfig : ?Stripe.StripeConfiguration = null;

  // Public query - accessible to all
  public query func isStripeConfigured() : async Bool {
    stripeConfig != null;
  };

  // Admin only
  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can configure Stripe");
    };
    stripeConfig := ?config;
  };

  func getStripeConfig() : Stripe.StripeConfiguration {
    switch (stripeConfig) {
      case (null) { Runtime.trap("Stripe not configured") };
      case (?conf) { conf };
    };
  };

  // Implement the public functions that need to be available
  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Keep createCheckoutSession as originally scoped `shared ({ caller })` so that all principals can create an order and check out
  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfig(), caller, items, successUrl, cancelUrl, transform);
  };

  // Public function - accessible to all (checking payment status)
  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfig(), sessionId, transform);
  };
};
