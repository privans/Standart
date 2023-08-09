import { ChatMessage, SendMessageRequest } from "../models/messages/SendMessageRequest";
import _ from "lodash";
import { isAddress, isHexString } from "ethers";
import { VaChatRoomEntityItem } from "../validators/VaChatRoomEntityItem";
import { Web3Digester, Web3Signer } from "debeem-id";
import { PrivateMessageCrypto } from "../cryptos/PrivateMessageCrypto";
import { ChatRoomEntityItem } from "../entities/ChatRoomEntity";
import { BaseMessageBuilder } from "./BaseMessageBuilder";


/**
 * 	@class
 */
expo