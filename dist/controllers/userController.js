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
exports.updateProfile = exports.editLoad = exports.userLogout = exports.loadHome = exports.verifyLogin = exports.loginLoad = exports.insertUser = exports.loadRegister = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const _1 = __importDefault(require("../models/*"));
// Secure password hashing function
const securePassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const passwordHash = yield bcrypt_1.default.hash(password, 10);
        return passwordHash;
    }
    catch (error) {
        console.log(error.message);
    }
});
// Load registration page
const loadRegister = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('registration');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadRegister = loadRegister;
// Insert a new user
const insertUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const spassword = yield securePassword(req.body.password);
        const user = new _1.default({
            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mno,
            image: (_a = req.file) === null || _a === void 0 ? void 0 : _a.filename,
            password: spassword,
            is_admin: 0
        });
        const userData = yield user.save();
        if (userData) {
            res.render('registration', { message: "Your registration has been successful!!" });
        }
        else {
            res.render('registration', { message: "Your registration has failed!!!" });
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.insertUser = insertUser;
// Load login page
const loginLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.render('login');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loginLoad = loginLoad;
// Verify user login
const verifyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userData = yield _1.default.findOne({ email: email });
        if (userData) {
            const passwordMatch = yield bcrypt_1.default.compare(password, userData.password);
            if (passwordMatch) {
                if (userData.is_verified === 0) {
                    res.render('login', { message: "Please verify your mail." });
                }
                else {
                    req.session.user_id = userData._id;
                    res.redirect('/home');
                }
            }
            else {
                res.render('login', { message: "Email and Password are incorrect" });
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
// Load home page
const loadHome = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = yield _1.default.findById({ _id: req.session.user_id });
        res.render('home', { user: userData });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.loadHome = loadHome;
// Logout user
const userLogout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.session.destroy(() => {
            res.redirect('/');
        });
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.userLogout = userLogout;
// Load edit user page
const editLoad = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const userData = yield _1.default.findById(id);
        if (userData) {
            res.render('edit', { user: userData });
        }
        else {
            res.redirect('/home');
        }
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.editLoad = editLoad;
// Update user profile
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (req.file) {
            yield _1.default.findByIdAndUpdate(req.body.user_id, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno,
                    image: req.file.filename
                }
            });
        }
        else {
            yield _1.default.findByIdAndUpdate(req.body.user_id, {
                $set: {
                    name: req.body.name,
                    email: req.body.email,
                    mobile: req.body.mno
                }
            });
        }
        res.redirect('/home');
    }
    catch (error) {
        console.log(error.message);
    }
});
exports.updateProfile = updateProfile;
