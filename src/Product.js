function Product() {
    const amount =1000;
    const currency = "INR";
    const receiptId = "qwsaq1";
    const planId = "plan_OCfYwVV27iaSO5";

    const paymentHandler = async (e) =>{
        const response = await fetch("http://localhost:5000/order",{
            method: "POST",
            body: JSON.stringify({
                amount,
                currency,
                receipt: receiptId,
                
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);
    var options = {
        key: "rzp_test_7Ag0Khhv4Hm5vY", // Enter the Key ID generated from the Dashboard
        amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency,
        name: "NativeKart", //your business name
        description: "Test Transaction",
        image: "https://www.pngegg.com/en/png-wlegt",
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1

        handler: async function (response) {
          const body = {
            ...response,
          };
  
          const validateRes = await fetch(
            "http://localhost:5000/order/validate",
            {
              method: "POST",
              body: JSON.stringify(body),
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
          const jsonRes = await validateRes.json();
          console.log(jsonRes);
        },
        prefill: {
          //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
          name: "Sai Venkatesh", //your customer's name
          email: "webdevmatrix@example.com",
          contact: "9000000000", //Provide the customer's phone number for better conversion rates
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#00B4D8",
        },
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response) {
        alert(response.error.code);
        alert(response.error.description);
        alert(response.error.source);
        alert(response.error.step);
        alert(response.error.reason);
        alert(response.error.metadata.order_id);
        alert(response.error.metadata.payment_id);
      });
      rzp1.open();
      e.preventDefault();
};

const subscribeHandler = async (e) => {
  e.preventDefault();

  // Create subscription on the backend
  const response = await fetch("http://localhost:5000/subscription", {
      method: "POST",
      body: JSON.stringify({ plan_id: planId }),
      headers: {
          "Content-Type": "application/json",
      },
  });

  const subscription = await response.json();
  console.log(subscription);

  // Redirect to the short_url
  window.location.href = subscription.short_url;
};


    return (
        <>
        <h1>Hey You🫵</h1>
        <h3>Pay Karo</h3>
        <button onClick={paymentHandler}>Pay</button><br></br>
        <button onClick={subscribeHandler}>Subscribe</button>
        </>
    );
}


export default Product;