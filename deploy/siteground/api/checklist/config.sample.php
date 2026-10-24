<?php
declare(strict_types=1);

/**
 * Copy to config.php on SiteGround. Do not commit config.php.
 *
 * checklist_owner_secret — you enter this once on your phone as the "owner key".
 * checklist_bot_token — same value goes in your Grok bot env as CHECKLIST_BOT_TOKEN.
 */
return [
    'mysql_host' => 'localhost',
    'mysql_port' => 3306,
    'mysql_user' => 'YOUR_MYSQL_USER',
    'mysql_password' => 'YOUR_MYSQL_PASSWORD',
    'mysql_database' => 'YOUR_MYSQL_DATABASE',

    'checklist_owner_secret' => 'CHANGE_ME_LONG_RANDOM_OWNER_KEY',
    'checklist_bot_token' => 'CHANGE_ME_DIFFERENT_BOT_TOKEN',
];
