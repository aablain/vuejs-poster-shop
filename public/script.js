var PRICE = 9.99;
var LOAD_NUM = 10;

new Vue ({
  el: '#app',
  data: {
    total: 0,
    items: [],
    cart: [],
    results: [],
    newSearch: 'anime',
    lastSearch: '',
    loading: false,
    price: PRICE
  },
  computed: {
    noMoreItems: function() {
      return (this.items.length === this.results.length && this.results.length > 0);
    }
  },
  methods: {
    appendItems: function() {
      if (this.items.length < this.results.length) {
        var append = this.results.slice(this.items.length, this.items.length + LOAD_NUM);
        this.items = this.items.concat(append);
      }
    },
    onSubmit: function() {
      if (this.newSearch.length) {
        this.items = [];
        this.loading = true;
        this.$http.get('/search/'.concat(this.newSearch))
        .then(function(res) {
          this.lastSearch = this.newSearch;
          this.results = res.data;
          this.appendItems();
          this.loading = false;
        });
      }
    },
    addItem: function(priceOfItem, item) {
      var found = false;
      for (var i = 0; i < this.cart.length; i++) {
        if (this.cart[i].id === item.id) {
          found = true;
          this.cart[i].qty++;
          this.cart[i].cost += priceOfItem;
          this.total += priceOfItem;
          break;
        }
      }
      if (!found) {
        this.total += priceOfItem;
        this.cart.push({
          id: item.id,
          title: item.title,
          qty: 1,
          price: priceOfItem,
          cost: priceOfItem
        });
      }
    },
    addOne: function(product) {
      product.qty++;
      product.cost += product.price;
      this.total += product.price;
    },
    removeOne: function(product) {
      product.qty--;
      product.cost -= product.price;
      this.total -= product.price;
      if (product.qty <= 0) {
        for (var j = 0; j < this.cart.length; j++) {
          if (this.cart[j].id === product.id) {
            this.cart.splice(j, 1);
            break;
          }
        }
      }
    }
  },
  filters: {
    currency: function(price) {
      return '$'.concat(price.toFixed(2));
    }
  },
  mounted: function() {
    this.onSubmit();

    var vueInstance = this;
    var elem = document.getElementById('product-list-bottom');
    var watcher = scrollMonitor.create(elem);
    watcher.enterViewport(function() {
      vueInstance.appendItems();
    });
  }
});
