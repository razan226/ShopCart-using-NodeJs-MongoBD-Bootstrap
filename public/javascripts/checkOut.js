console.log("lll")
Stripe('pk_test_51OSFs2BMXVViwQxaXHckQ6GsnPWhyEvFprxjyh7dNRCFZAd8neMnRuuDhhtAFgzvWlfY9RVl9h4OrdLh9sYZSmk600LZuOTDq7');

var $form = $('#checkout-form'); //variable contain all the form from hbs file

//this code wait until a submit action happend in the hbs file when click
$form.submit(function(event) {
    $form.find('button').prop('disabled', true);

    // Use the createToken method to create a token to make http req 
    // to start get the data the user req  them to the api server
    stripe.card.createToken({
        number : $('#card-number').val(),
        cvc : $('#card-cvc').val(),
        exp_month : $('#card-expiry-month').val(),
        exp_year : $('#card-expiry-year').val()

    }, stripeResponseHandler);

    return false ; // to say nothing error happened
});

function stripeResponseHandler(status, response) {
    if (response.error) {
        
        // show the errors on the form
        $("#payment-errors").text(response.error.message);
        $("#payment-errors").removeClass('d-none');
        $form.find("button").prop("disabled, false");
    } else {
        // token contains id, last4, and card type
        var token = response.id;
        // insert the token into the form so it gets submitted to the serverfunction stripeResponseHandler(status, response) 
        form$.append($('< input type="hidden" name="stripeToken" />').val(token));
        // and submit
        form$.get(0).submit();
    }
}
       
