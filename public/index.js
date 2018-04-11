/* global Vue, VueRouter, axios */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      people: [],
      newPersonName: "",
      newPersonBio: ""
    };
  },
  created: function() {
    axios.get("/v1/people").then(
      function(response) {
        this.people = response.data;
      }.bind(this)
    );
  },
  methods: {
    createPerson: function() {
      var params = {
        name: this.newPersonName,
        bio: this.newPersonBio
      };
      axios.post("/v1/people", params).then(
        function(response) {
          this.people.push(response.data);
          this.newPersonName = "";
          this.newPersonBio = "";
        }.bind(this)
      );
    },
    deletePerson: function(inputPerson) {
      var index = this.people.indexOf(inputPerson);
      this.people.splice(index, 1);
    },
    toggleBioVisible: function(inputPerson) {
      inputPerson.bioVisible = !inputPerson.bioVisible;
    }
  },
  computed: {}
};

var router = new VueRouter({
  routes: [{ path: "/", component: HomePage }],
  scrollBehavior: function(to, from, savedPosition) {
    return { x: 0, y: 0 };
  }
});

var app = new Vue({
  el: "#vue-app",
  router: router
});
