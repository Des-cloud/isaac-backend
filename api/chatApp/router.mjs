import { Router } from "express";
import ChatCtrl from "./chatController.mjs";
import MessageCtrl from "./messageController.mjs";

const router = new Router();

router.route("/").get(ChatCtrl.getChats).post(ChatCtrl.addChat);
router.route("/specific").get(ChatCtrl.getSpecificChats);

router.route("/:id").get(ChatCtrl.getChat).delete(ChatCtrl.deleteChat);

router.route("/:chatId/activeMembers").post(ChatCtrl.addActiveMember);

router
  .route("/:chatId/activeMembers/:username")
  .delete(ChatCtrl.deleteActiveMember);

router
  .route("/:chatId/messages")
  .get(MessageCtrl.getMessages)
  .post(MessageCtrl.addMessage);

router
  .route("/:chatId/messages/:id")
  .get(MessageCtrl.getMessage)
  .delete(MessageCtrl.deleteMessage);

export default router;
