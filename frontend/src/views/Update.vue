<template>
  <div>
    <Nav></Nav>
    <!-- <Home></Home> bg -->
    <div class="container">
      <div class="profile-page tx-13">
        <Header></Header>
        <div
            class="row profile-body d-flex flex-row justify-content-center ms-5"
        >
          <!-- Pour mettre de publication -->
          <!-- middle wrapper start -->
          <div class="col-xl-6 middle-wrapper">
            <div class="row mt-2 mt-md-2 mt-lg-0">
              <div class="col-md-12">
                <div class="card rounded">
                  <div class="card-header">
                    <div class="d-flex flex-column justify-content-start">
                      <div class="d-flex justify-content-start border-bottom">
                        <div class="ml-2 d-flex me-3">
                          <h3 class="mt-3 mb-3 h5">
                            Paramètres généraux du compte
                          </h3>
                        </div>
                      </div>
                      <div
                          class="
                          d-flex
                          justify-content-between
                          border-bottom
                          edit-row edit-row--transition
                        "
                      >
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">Prénom:</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">{{ user.firstName }}</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <div class="col-sm-6 col-md-9 mt-2">
                            <input
                                class="form-control mr-sm-2 bg-light"
                                v-model="firstName"
                                :maxlength="max"
                                type="text"
                                placeholder="Edit"
                                aria-label="Edit"
                            />
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                              class="
                              btn btn-primary btn-icon-text btn-edit-profile
                            "
                              @click="_updateUser"
                          >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between border-bottom">
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">Nom:</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">{{ user.lastName }}</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <div class="ml-2 d-flex">
                            <div class="col-sm-6 col-md-9 mt-2">
                              <input
                                  class="form-control mr-sm-2 bg-light"
                                  v-model="lastName"
                                  :maxlength="max"
                                  type="text"
                                  placeholder="Edit"
                                  aria-label="Edit"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                              class="
                              btn btn-primary btn-icon-text btn-edit-profile
                            "
                              @click="_updateUser"
                          >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between border-bottom">
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">Pseudeo:</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">{{ user.userName }}</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <div class="ml-2 d-flex">
                            <div class="col-sm-6 col-md-9 mt-2">
                              <input
                                  class="form-control mr-sm-2 bg-light"
                                  v-model="userName"
                                  :maxlength="max"
                                  type="text"
                                  placeholder="Edit"
                                  aria-label="Edit"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                              class="
                              btn btn-primary btn-icon-text btn-edit-profile
                            "
                              @click="_updateUser"
                          >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between border-bottom">
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">Email:</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">{{ user.email }}</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <div class="ml-2 d-flex">
                            <div class="col-sm-6 col-md-9 mt-2">
                              <input
                                  class="form-control mr-sm-2 bg-light"
                                  :maxlength="max"
                                  type="email"
                                  v-model="email"
                                  placeholder="Edit"
                                  aria-label="Edit"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                              class="
                              btn btn-primary btn-icon-text btn-edit-profile
                            "
                              @click="_updateUser"
                          >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                            Edit
                          </button>
                        </div>
                      </div>
                      <div class="d-flex justify-content-between border-bottom">
                        <div class="ml-2 d-flex">
                          <span class="mt-3 mb-3">Password:</span>
                        </div>
                        <div class="ml-2 d-flex">
                          <div class="ml-2 d-flex">
                            <div class="col-sm-6 col-md-9 mt-2">
                              <input
                                  class="form-control mr-sm-2 bg-light"
                                  type="password"
                                  v-model="password"
                                  placeholder="Edit"
                                  aria-label="Edit"
                              />
                            </div>
                          </div>
                        </div>
                        <div class="mt-2">
                          <button
                              class="
                              btn btn-primary btn-icon-text btn-edit-profile
                            "
                              @click="_updateUser"
                          >
                            <font-awesome-icon :icon="['fas', 'edit']" />
                            Edit
                          </button>
                        </div>
                      </div>

                      <div class="mt-2 mb-2">
                        <button
                            class="
                            btn btn-danger btn-icon-text btn-edit-profile
                            d-flex
                            justify-content-center
                          "
                            @click="_deleteUser"
                        >
                          Supprimer compte
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- middle wrapper end -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
// import axios from "axios";
//  getting the current user via the state by mapGetters
import Nav from "../components/Nav.vue";
import Header from "../components/Header.vue";
export default {
  name: "Home",
  components: {
    Nav,
    Header,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      userName: "",
      email: "",
      password: "",
      max: 50,
    };
  },
  // Logique pour pouvoir aller vers la page update si on clique update
  methods: {
    toUpdate() {
      this.$router.push({ name: "Update" });
    },
    _deleteUser: function () {
      const dynamicId = this.user.id;
      // const clearToken = localStorage.clear("userToken");
      this.$store
          .dispatch("deleteAccount", { dynamicId })
          .then((response) => {
            console.log(response);
            if (response) {
              this.$router.push({ name: "Login" });
            }
          })
          .catch((error) => {
            console.log(error);
          });
    },
    // createUpdatePost
    _updateUser: function () {
      //const updateUser = `api/user/account/${this.user.id}`;
      const thisFirstName = this.firstName;
      const thisLastName = this.lastName;
      const thisUserName = this.userName;
      const thisEmail = this.email;
      const thisPassword = this.password;
      this.$store
          .dispatch("updateProfil", {
            thisFirstName,
            thisLastName,
            thisUserName,
            thisEmail,
            thisPassword,
          })
          .then((response) => {
            console.log(response);
            this.$router.push({ name: "Home" });
          })
          .catch((error) => {
            console.log(error);
          });
    },
  },
  // Logique pour récuperer les datas depuis la base de données MySQL
  computed: {
    //  getting the current user via the state by mapGetters
    ...mapGetters(["user", "post", "posts", "comment", "comments"]),
  },
};
</script>

<style lang="scss" scoped>
body {
  background-color: #f9fafb;
  margin-top: 20px;
}
.profile-body {
  div {
    padding-left: 3px;
    padding-right: 3px;
  }
  .profile-pic {
    width: 6rem;
    height: auto;
  }
  p {
    text-align: left;
    padding: 0 0 0 0;
  }
  label {
    margin-right: 5rem;
  }
  .img-xs {
    width: 3rem;
    height: auto;
  }
  .s-image {
    width: 3rem;
    height: 3rem;
  }
}
// card footer
.card-header {
  padding: 0 0 0 0;
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0);
}
.card-footer {
  background-color: white;
  border-top: 1px solid #f2f4f9;
  li {
    a {
      color: #000;
      transition: all 0.2s ease;
    }
    &:hover,
    &.active,
    &:hover a,
    &.active a {
      text-decoration: underline;
    }
  }
  .me-perso {
    margin-right: 4rem !important;
  }
  .ms-perso-2 {
    margin-left: 0.15rem !important;
  }
}
.card {
  box-shadow: 0 0 10px 0 rgba(183, 192, 206, 0.2);
}
</style>