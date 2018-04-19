/* global Vue, VueRouter, axios, google */

var HomePage = {
  template: "#home-page",
  data: function() {
    return {
      errors: [],
      people: [],
      newPersonName: "",
      newPersonBio: "",
      editPersonName: "",
      editPersonBio: ""
    };
  },
  created: function() {
    axios.get("/v1/people").then(
      function(response) {
        this.people = response.data;
      }.bind(this)
    );
  },
  mounted: function() {
    var map;
    map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: -34.397, lng: 150.644 },
      zoom: 8
    });
  },
  methods: {
    createPerson: function() {
      this.errors = [];

      var params = {};
      if (this.newPersonName) {
        params.name = this.newPersonName;
      }
      if (this.newPersonBio) {
        params.bio = this.newPersonBio;
      }

      axios
        .post("/v1/people", params)
        .then(
          function(response) {
            this.people.push(response.data);
            this.newPersonName = "";
            this.newPersonBio = "";
          }.bind(this)
        )
        .catch(
          function(error) {
            console.log("something went wrong", error.response.data.errors);
            this.errors = error.response.data.errors;
          }.bind(this)
        );
    },
    updatePerson: function(inputPerson) {
      console.log("gonna update", inputPerson);
      var params = {};
      if (this.editPersonName) {
        params.name = this.editPersonName;
      }
      if (this.editPersonBio) {
        params.bio = this.editPersonBio;
      }
      axios.patch("/v1/people/" + inputPerson.id, params).then(
        function(response) {
          inputPerson.name = response.data.name;
          inputPerson.bio = response.data.bio;
          this.editPersonName = "";
          this.editPersonBio = "";
        }.bind(this)
      );
    },
    deletePerson: function(inputPerson) {
      axios.delete("/v1/people/" + inputPerson.id).then(function(response) {
        console.log(response.data);
        var index = this.people.indexOf(inputPerson);
        this.people.splice(index, 1);
      });
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
