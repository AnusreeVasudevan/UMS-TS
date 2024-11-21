"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUsers = exports.editUserLoad = exports.addUser = exports.newUserLoad = exports.adminDashboard = exports.logout = exports.loadDashboard = exports.verifyLogin = exports.loadLogin = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const randomstring_1 = __importDefault(require("randomstring"));
const _1 = __importDefault(require("../models/*"));
const secure_password_1 = __importDefault(require("secure-password")); // Assuming `secure-password` provides a named export
const securePassword = new secure_password_1.default(); // Assuming the package works this way
// Load login page
const loadLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('login');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadLogin = loadLogin;
// Verify login
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const userData = yield _1.default.findOne({ email });
        if (userData) {
            const passwordMatch = yield bcrypt_1.default.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_admin === 0) {
                    res.render('login', { message: "Email and Password are incorrect!" });
                }
                else {
                    req.session.user_id = userData._id;
                    res.redirect("/admin/home");
                }
            }
            else {
                res.render('login', { message: "Email and Password are incorrect!!" });
            }
        }
        else {
            res.render('login', { message: "Email and Password are incorrect!!!" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.verifyLogin = verifyLogin;
// Load dashboard
const loadDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield _1.default.findById(req.session.user_id);
        res.render('home', { admin: userData });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadDashboard = loadDashboard;
// Logout
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy(() => {
            res.redirect('/admin');
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.logout = logout;
// Admin dashboard
const adminDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield _1.default.find({ is_admin: 0 });
        res.render('dashboard', { users: userData });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.adminDashboard = adminDashboard;
// Add new user
const newUserLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('new-user');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.newUserLoad = newUserLoad;
const addUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { name, email, mno } = req.body;
        const image = (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename;
        const password = randomstring_1.default.generate(8);
        const spassword = yield securePassword.hash(Buffer.from(password)); // Adjusted for `secure-password`
        const user = new _1.default({
            name,
            email,
            mobile: mno,
            image,
            password: spassword.toString(),
            is_admin: 0
        });
        const userData = yield user.save();
        if (userData) {
            res.redirect('/admin/dashboard');
        }
        else {
            res.render('new-user', { message: "Something went wrong!!!" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.addUser = addUser;
// Edit user
const editUserLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const userData = yield _1.default.findById(id);
        if (userData) {
            res.render('edit-user', { user: userData });
        }
        else {
            res.redirect('/admin/dashboard');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.editUserLoad = editUserLoad;
const updateUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, name, email, mno, verify } = req.body;
        yield _1.default.findByIdAndUpdate(id, { name, email, mobile: mno, is_verified: verify });
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.updateUsers = updateUsers;
// Delete user
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        yield _1.default.deleteOne({ _id: id });
        res.redirect('/admin/dashboard');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.deleteUser = deleteUser;
