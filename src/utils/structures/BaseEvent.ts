import { Events } from "discord.js";
import DiscordClient from "../../client/Client";

export default abstract class BaseEvent {
  constructor(private name: Events) {}

  getName(): Events {
    return this.name;
  }

  abstract run(client: DiscordClient, ...args: any): void;
}
