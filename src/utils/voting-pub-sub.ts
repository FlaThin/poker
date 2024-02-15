type Message = { pokerOptionId: string, votes: number }
type Subscriber = (message: Message) => void

class VotingPubSub {
  private channels: Record<string, Subscriber[]> = {};

  subscribe(pokerId: string, subscriber: Subscriber) {
    if (!this.channels[pokerId]) {
      this.channels[pokerId] = []
    }

    this.channels[pokerId].push(subscriber);
  }

  publish(pokerId: string, message: Message) {

    if(!this.channels[pokerId]) {
      return
    }

    for (const subscriber of this.channels[pokerId]) {
      subscriber(message);
    }
  }
}


export const voting = new VotingPubSub();