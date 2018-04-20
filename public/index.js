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
    var uluru = { lat: -25.363, lng: 131.044 };
    var map = new google.maps.Map(document.getElementById("map"), {
      zoom: 4,
      center: uluru
    });

    var contentString =
      '<div id="content">' +
      '<div id="siteNotice">' +
      "</div>" +
      '<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
      '<div id="bodyContent">' +
      "<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large " +
      "sandstone rock formation in the southern part of the " +
      "Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) " +
      "south west of the nearest large town, Alice Springs; 450&#160;km " +
      "(280&#160;mi) by road. Kata Tjuta and Uluru are the two major " +
      "features of the Uluru - Kata Tjuta National Park. Uluru is " +
      "sacred to the Pitjantjatjara and Yankunytjatjara, the " +
      "Aboriginal people of the area. It has many springs, waterholes, " +
      "rock caves and ancient paintings. Uluru is listed as a World " +
      "Heritage Site.</p>" +
      '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
      "https://en.wikipedia.org/w/index.php?title=Uluru</a> " +
      "(last visited June 22, 2009).</p>" +
      "</div>" +
      "</div>";

    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });

    var marker = new google.maps.Marker({
      position: uluru,
      map: map,
      title: "Uluru (Ayers Rock)"
    });
    marker.addListener("click", function() {
      infowindow.open(map, marker);
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
