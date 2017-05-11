export const Bitbucket = {
  config: {
    notificationChannelId: 'C3MMUMS90',
    icon_url: 'https://cocktail-insights.github.io/assets/adgeek/logo/1024x1024.png',
  },
  processWebhookResult(webhookResult) {
    const { actor, repository, push } = webhookResult;
    const { username, display_name } = actor;

    const branchChanges = push.changes.filter(change => (change.new && change.new.type === 'branch') || (change.old && change.old.type === 'branch'));

    if (branchChanges.length) {
      return branchChanges.map((change) => {
        // console.log(JSON.stringify(change));
        return {
          repoName: repository.full_name,
          branchName: (change.new && change.new.name) || (change.old && change.old.name),
          username,
          display_name,
          created: change.created,
          closed: change.closed,
          commitCount: (change.commits && change.commits.length) || 0,
          url: change.new ? change.new.links.html.href : '',
        };
      });
    }

    return null;
  },
};
