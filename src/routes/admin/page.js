const express = require('express');
const { upload, requireSignin, adminMiddleware } = require('../../common-middleware');
const { createPage, getPage } = require('../../controller/admin/page');
const router = express.Router();

router.post(`/page/create`, requireSignin, adminMiddleware, upload.fields([
    { name: 'banners' },
    { name: 'products' }
]), createPage)

router.get(`/page/:category/:type`, getPage);

module.exports = router;