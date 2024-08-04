const express = require("express");

const {
	getUserProfile,
	updateUserProfile,
	deleteUserProfile,
} = require("../controllers/user");
const { verifyToken, checkAdmin } = require("../middlewares/auth");

const router = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       401:
 *         description: Not authorized, token failed
 *       400:
 *         description: Bad Request
 */
router.get("/profile", verifyToken, getUserProfile);

/**
 * @swagger
 * /api/users/profile:
 *   put:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: authorization
 *         in: header
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 role:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Not authorized, token failed
 *       400:
 *         description: Bad Request
 *
 */
router.put("/profile", verifyToken, updateUserProfile);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *       - name: authorization
 *         in: header
 *         required: true
 *         example: Bearer ${TOKEN}
 *     responses:
 *       200:
 *         description: User removed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: User not found
 *       401:
 *         description: Not authorized as an admin
 *       400:
 *         description: Bad Request
 */
router.delete("/:id", verifyToken, checkAdmin, deleteUserProfile);

module.exports = router;
