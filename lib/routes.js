'use strict';

import express from 'express';
import {
  Bitbucket,
} from './modules';
import Slack from './slack';

const router = express.Router();
const slackClient = new Slack(process.env.SLACK_TOKEN);

function createdUpdatedOrClosed(created, closed) {
  return created ? 'created' : closed ? 'closed' : 'updated';  // eslint-disable-line
}

/**
 * Bitbucket Webhook. Listening for branch creation and updates
 */
router.post('/bitbucket', (req, res) => {
  const bitbucketDataArray = Bitbucket.processWebhookResult(req.body);
  if (bitbucketDataArray) {
    return bitbucketDataArray.forEach(async (bitbucketData) => {
      const slackMessage =
        `*${bitbucketData.branchName}* ${(bitbucketData.commitCount < 5 && bitbucketData.commitCount > 0) ? `_(${bitbucketData.commitCount} commits)_` : '_(4+ commits)_'} _${createdUpdatedOrClosed(bitbucketData.created, bitbucketData.closed)} by_ ${bitbucketData.display_name} (${bitbucketData.username}) on *${bitbucketData.repoName}*`;

      try {
        await slackClient.sendMessage(Bitbucket.config.notificationChannelId,
          '', {
            icon_url: Bitbucket.config.icon_url,
            username: 'AdGeek-Bitbucket',
            attachments: [{
              color: '#034E9B',
              pretext: '',
              title: bitbucketData.url ? 'View on Bitbucket' : '',
              title_link: bitbucketData.url,
              text: slackMessage,
              mrkdwn_in: ['text'],
            }],
          });
        // console.log(result);
        return res.status(200).send({
          success: true,
          message: 'Slack notification sent',
        });
      } catch (error) {
        // console.log(error);
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }
    });
  }

  return res.send();
});

export default router;
