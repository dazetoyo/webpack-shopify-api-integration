import Client from "shopify-buy";

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  domain: "store.dailystoic.com",
  storefrontAccessToken: "2e7b88e294638218b3513ec41e0bd3c8"
});

const queryString = window.location.search;
//console.log(queryString);

var getID = queryString.split("?id=").pop();
// console.log(getID);
//
// console.log(Client);

const productId = btoa("gid://shopify/Product/" + getID);
// const productId = "Z2lkOi8vc2hvcGlmeS9Qcm9kdWN0LzQ1NTc5NDY0ODY4OTM=";
// test dummy product id 4557946486893 non encoded

client.product.fetch(productId).then(product => {
  // Do something with the product
  // console.log(product);
  // console.log(typeof product);
  // console.log(product.title);
  // console.log(product.variants[0].id);
  window.MaskedProduct = product.variants[0].id;
  //console.log(window.MaskedProduct);
  //
  // var normalProduct = atob(product.variants[0].id);
  // console.log(normalProduct);
  // window.normalProductID = normalProduct.split("/ProductVariant/").pop();
  // console.log(normalProductID);
});

// Create an empty checkout

window.onload = function() {
  document
    .getElementById("deliveryEmailInput")
    .addEventListener("keyup", function(event) {
      // event.preventDefault();
      if (event.keyCode === 13) {
        sessionStorage.setItem("reloading", "true");
        var emailvalue = document.getElementById("deliveryEmailInput").value;
        var checkboxvalue = document.getElementById("giftCheckbox").checked;
        sessionStorage.setItem("emailvalue", emailvalue);
        sessionStorage.setItem("checkboxvalue", checkboxvalue);
        document.location.reload();
      }
    });
  var reloading = sessionStorage.getItem("reloading");
  var emailstorage = sessionStorage.getItem("emailvalue");
  var checkboxstorage = sessionStorage.getItem("checkboxvalue");
  if (reloading) {
    document.getElementById("deliveryEmailInput").value = emailstorage;
    if (checkboxstorage === "true") {
      document.getElementById("giftCheckbox").click();
    }
    sessionStorage.removeItem("reloading");
    window.SendData();
    sessionStorage.removeItem("emailvalue");
    sessionStorage.removeItem("checkboxvalue");
  }
};
window.SendData = function() {


      var checkout_delivery = window.open(
        "",
        "Title=Checkout Delivery",
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=700,top=50"
      );

      myWindow.document.write("<p>I replaced the current window.</p>");

  var emailvalue = document.getElementById("deliveryEmailInput").value;

  console.log(emailvalue);

  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(emailvalue)) {
  } else {
    alert("You have entered an invalid email address!");
    return false;
  }

  if (document.getElementById("giftCheckbox").checked) {
    var property = "Gifting";
  } else {
    var property = "Delivery";
  }

  client.checkout.create().then(checkout => {
    const checkoutId = checkout.id; // ID of an existing checkout
    const lineItemsToAdd = [
      {
        variantId: window.MaskedProduct,
        quantity: 1,
        customAttributes: [{ key: property, value: emailvalue }]
      }
    ];
  //  console.log(lineItemsToAdd);

    // Add an item to the checkout
    client.checkout.addLineItems(checkoutId, lineItemsToAdd).then(checkout => {
      // Do something with the updated checkout
      // console.log(checkout.lineItems);

      var win = window.open(
        checkout.webUrl,
        "Title=Checkout",
        "toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes,resizable=yes,width=1280,height=700,top=50"
      );
    });
    // Do something with the checkout
  //  console.log(checkout);
    //console.log(typeof checkout);
    // var pre = document.createElement("pre");
    //
    // win.document.body.appendChild(pre);
    // pre.innerHTML = JSON.stringify(checkout, null, 4);
    // pre.appendChild(JSON.stringify(checkout, null, 4));
  });
};
