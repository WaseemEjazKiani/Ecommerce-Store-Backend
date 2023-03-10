const express = require("express");
const {registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword,
         updateUserProfile, getAllUsers, getSingleUser, updateUserRole, deleteUser} = require("../controller/userController");

     const { isAuthUser, authorizedRole } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").get(logout);
router.route("/password/forgot").post(forgotPassword);
router.route("/password/reset/:token").post(resetPassword);
router.route("/me").get(isAuthUser ,getUserDetails);
 
router.route("/password/update").put(isAuthUser ,updatePassword);

router.route("/me/update").put(isAuthUser ,updateUserProfile); 

router.route("/admin/users").get(isAuthUser , authorizedRole("admin"), getAllUsers); 

router.route("/admin/user/:id").get(isAuthUser , authorizedRole("admin"), getSingleUser); 

router.route("/admin/user/:id").put(isAuthUser , authorizedRole("admin"), updateUserRole)
.delete(isAuthUser , authorizedRole("admin"), deleteUser); 


module.exports = router;

