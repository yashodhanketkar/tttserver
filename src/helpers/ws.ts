import { wsInstance } from "../server";

class WebScoketHelperClass {
  sender = async (message: string) => {
    const wsClients = wsInstance.getWss().clients;
    wsClients.forEach((client) => {
      client.send(message);
    });
  };
}

export const WebScoketHelper = new WebScoketHelperClass();
