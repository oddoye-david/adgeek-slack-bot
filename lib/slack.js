'use strict';

import { WebClient } from '@slack/client';

export default function Slack(token) {
  const slackClient = new WebClient(token);

  return {

    /**
     * Send message to slack channel
     *
     * @param {String} channelId
     * @param {String} message
     * @param {any} [opts={}]
     * @returns
     */
    sendMessage(channelId, message, opts = {}) {
      return new Promise((resolve, reject) => {
        slackClient.chat.postMessage(channelId, message, opts, (err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
      });
    },
  };
}
