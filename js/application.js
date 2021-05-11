'use strict';

let totalQty = undefined;
let totalCost = undefined;
let remove = undefined;
let add = undefined;
let price = undefined;
let qty = undefined;


// Currency Formatter
// https://flaviocopes.com/how-to-format-number-as-currency-javascript/
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

const updateListeners = () => {
  remove = Array.from(document.querySelectorAll('.grocery-item .remove'));

  remove.forEach(el => {
    el.addEventListener('click', function (el) {
      const parentEl = findParentBySelector(el.target, '.columns.grocery-item');

      console.log(parentEl);
      parentEl.parentNode.removeChild(parentEl);
      updateTotalCosts();
      updateListeners();

    });
  });


  price = Array.from(document.querySelectorAll('.cost input'));
  price.forEach(el => {
    el.addEventListener('input', function(e) {
      updateTotalCosts();
      console.log(e);
    });
  });
  qty = Array.from(document.querySelectorAll('.qty input'));
  
  add = document.querySelector('.add').addEventListener('click', addItemToList);

}

document.addEventListener('DOMContentLoaded', function() {
  totalQty = document.querySelector('#total-items');
  totalCost = document.querySelector('#total-cost');

  updateTotalCosts();
  updateListeners();


  const el = document.createElement('div');
document.querySelector('body').appendChild(el)

  var timeout;
  var updateList = function() {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        updateTotalCosts();
    }, 250);
  }


});

// template string 
var templateString = `<!-- Template Row to add per item -->
      <div class="columns grocery-item is-centered">
        <div class="item-name column is-one-quarter">
          <!-- item name -->
          %ITEM%
        </div>
        <div class="cost column is-one-quarter">
          <!-- item price -->
          <input type="number" value="%PRICE%" />
        </div>
        <div class="qty column is-one-quarter">
          <!-- item quantity -->
          <input type="number" value="%QTY%" />
        </div>
        <div class="column is-one-quarter">
          <!-- item remove -->
          <div class="summary columns">
            <div class="total column is-one-half is-success">
              %TOTAL%
            </div>
            <div class="column is-one-half">
              <div class="button remove is-danger is-centered is-rounded"><i class="fa fa-remove"></i></div>0
            </div>
          </div>
        </div>
      </div>`;


  

var updateRowTotalCost = function(row) {
    console.log(row);

    const itemCost = row.querySelector('.cost input').value;
    const itemQty = row.querySelector('.qty input').value;

    const rowCostTotal = itemQty * itemCost;
    
    return {
        rowCostTotal: rowCostTotal,
        itemQty : itemQty
    };
}

var updateTotalCosts = function() {
    var totalCost = 0;
    var totalItems = 0;
    const items = Array.from(document.querySelectorAll('.grocery-item'));
      items.forEach(ele => {
        const {rowCostTotal, itemQty} = updateRowTotalCost(ele);
        ele.querySelector('.total').textContent = formatter.format(rowCostTotal);
        console.log(rowCostTotal, itemQty);
        totalItems += Number(itemQty);
        totalCost += Number(rowCostTotal);
    });

    document.querySelector('#total-items').textContent = totalItems;
    document.querySelector('#total-cost').textContent = formatter.format(Number(totalCost));

}

var addItemToList = function() {
  const newItem = document.querySelector('#new-item');
  const newQty = document.querySelector('#new-qty');
  const newCost = document.querySelector('#new-cost');
    var item = newItem.value;
    var qty = newQty.value;
    var cost = newCost.value;
    
    console.log(item, qty, cost);

    // check values

    if (!item || !qty || !cost) {
        alert('Cannot add this item to the list.');
        return;
    }

    var item = templateString.replace(/%ITEM%/, item).replace(/%QTY%/, qty).replace(/%PRICE%/, cost);
    document.querySelector('.list').append(item);
    // $('.list').append(item);

    updateTotalCosts();
}




// $(document).ready(function () {
//     updateTotalCosts();
    
//     $('.list').parent().on('click', '.remove', function (event) {

//         $(this).parent().parent().parent().parent().remove();
//         updateTotalCosts();

//     });
    
//     $('.list').on('input', updateList);

//     $('.add').on('click', addItemToList); 



// });

function collectionHas(a, b) { //helper function (see below)
  for(var i = 0, len = a.length; i < len; i ++) {
      if(a[i] == b) return true;
  }
  return false;
}

function findParentBySelector(dom, selector) {
  var all = document.querySelectorAll(selector);
  var cur = dom.parentNode;
  console.log(cur, dom, selector, all);
  while(cur && !collectionHas(all, cur)) { //keep going up until you find a match
      cur = cur.parentNode; //go up
  }
  return cur; //will return null if not found
}
