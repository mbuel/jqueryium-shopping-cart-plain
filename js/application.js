'use strict';

// template string 
var templateString = `<!-- Template Row to add per item -->
      <div class="row grocery-item text-center">
        <div class="item-name col-3">
          <!-- item name -->
          %ITEM%
        </div>
        <div class="cost col-3">
          <!-- item price -->
          <input type="number" value="%PRICE%" />
        </div>
        <div class="qty col-3">
          <!-- item quantity -->
          <input type="number" value="%QTY%" />
        </div>
        <div class="col-3">
          <!-- item remove -->
          <div class="summary row">
            <div class="total col-6 text-success">
              %TOTAL%
            </div>
            <div class="col-6">
              <div class="btn remove btn-danger text-center rounded-pill"><i class="fa fa-remove"></i></div>
            </div>
          </div>
        </div>
      </div>`;

// Currency Formatter
// https://flaviocopes.com/how-to-format-number-as-currency-javascript/
const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  })
  

var updateRowTotalCost = function(row) {
    var itemQty = parseFloat($(row).find('.qty input').val());
    var itemCost = parseFloat($(row).find('.cost input').val());

    var rowCostTotal = itemQty * itemCost;
    $(row).find('.total').text(formatter.format(rowCostTotal));
    
    return {
        rowCostTotal: rowCostTotal,
        itemQty : itemQty
    };
}

var updateTotalCosts = function() {
    var totalCost = 0;
    var totalItems = 0;
    $('.list > .grocery-item').each(function(i, ele) {
        var {rowCostTotal, itemQty} = updateRowTotalCost(ele);
        console.log(rowCostTotal, itemQty);
        totalItems += itemQty;
        totalCost += rowCostTotal;
    });
    $('#total-items').text(Math.floor(totalItems));
    $('#total-cost').text(formatter.format(totalCost));
}

var addItemToList = function() {
    var item = $('#new-item').val();
    var qty = $('#new-qty').val();
    var cost = $('#new-cost').val();
    
    console.log(item, qty, cost);

    // check values

    if (!item || !qty || !cost) {
        alert('Cannot add this item to the list.');
        return;
    }

    var item = templateString.replace(/%ITEM%/, item).replace(/%QTY%/, qty).replace(/%PRICE%/, cost);

    $('.list').append(item);

    updateTotalCosts();
}


var timeout;
var updateList = function() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        updateTotalCosts();
    }, 250);
}

$(document).ready(function () {
    updateTotalCosts();
    
    $('.list').parent().on('click', '.remove', function (event) {

        $(this).parent().parent().parent().parent().remove();
        updateTotalCosts();

    });
    
    $('.list').on('input', updateList);

    $('.add').on('click', addItemToList); 



});
