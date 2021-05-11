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
      parentEl.classList.add('shrink');

      setTimeout(() => {
        parentEl.parentNode.removeChild(parentEl);
        updateTotalCosts();
        updateListeners();

      }, 200);

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

  qty.forEach(el => {
    el.addEventListener('input', function(e) {
      updateTotalCosts();
      console.log(e);
    });
  });
  
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
              <div class="button remove is-danger is-centered is-rounded">
              <i class="fa fa-remove"></i></div>
            </div>
          </div>
        </div>
      </div>`;


var buildNewRow = function(name, price, qty) {
  const base = document.createElement('div');
  base.classList = 'columns shrink grocery-item is-centered';

  const item = document.createElement('div');
  item.classList = 'item-name column is-one-quarter';
  item.textContent = name;

  base.appendChild(item);

  const cost = document.createElement('div');
  cost.classList = 'cost column is-one-quarter';

  const costInput = document.createElement('input');
  costInput.type = 'number'
  costInput.value = price;

  cost.appendChild(costInput);
  base.appendChild(cost);

  const count = document.createElement('div');
  count.classList = 'qty column is-one-quarter';

  const countInput = document.createElement('input');
  countInput.type = 'number'
  countInput.value = qty;

  count.appendChild(countInput);
  base.appendChild(count);

  const summary = document.createElement('div');
  summary.classList = 'column is-one-quarter';

  const container = document.createElement('div');
  container.classList = 'summary columns';

  const total = document.createElement('div');
  total.classList = 'total column is-one-half is-success';
  total.textContent = '----';

  const removeContainer = document.createElement('div');
  removeContainer.classList = 'column is-one-half';

  const removeButton = document.createElement('div');
  removeButton.classList = 'button remove is-danger is-centered is-rounded';

  const removeIcon = document.createElement('span');
  removeIcon.classList = 'fa fa-remove';

  removeButton.appendChild(removeIcon);
  removeContainer.appendChild(removeButton);

  container.appendChild(total);
  container.appendChild(removeContainer);

  summary.appendChild(container);

  base.appendChild(summary);

  return base;

}

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

    if (!item || !qty || !cost) {
        alert('Cannot add this item to the shopping list.');
        return;
    }
    
    console.log(item, qty, cost);

    const newRow = buildNewRow(item, cost, qty);
    document.querySelector('.list').appendChild(newRow);

    setTimeout(() => {
      newRow.classList.remove('shrink');
      newRow.classList.add('grow');
    }, 100)

    updateListeners();
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
