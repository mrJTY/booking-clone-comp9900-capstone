# Getting setup with AWS SSO
This isn't needed until you have to deploy things on the cloud.

I suggest do some local tests first before deploying anything, as it costs $.

Local tests can be run with: `amplify mock`.

If you really need to access `amplify, request access from the account admin. Instructions for single-sign-on will be sent via email.

# Logging into the console

After setting up your account from the email instructions, log in to the console via:
https://d-9a672dba1f.awsapps.com/start

It will only have limited access to AWS resources, limited only to basic AWS Amplify resources. If you need more access, send a request to the account admin.

Please keep things under the free tier! :)

https://aws.amazon.com/free/


# Setup AWS CLI

## Install AWS CLI v2

https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2.html

## Configure your AWS CLI

```shell
$ aws configure sso
SSO start URL [None]: https://d-9a672dba1f.awsapps.com/start                                                                                            
SSO Region [None]: us-east-2                 
                                                                                                           
# Follow the prompts, sign in with your browser

➜  blueskythinking git:(master) aws configure sso
SSO start URL [None]: https://d-9a672dba1f.awsapps.com/start                                                                                                                                                                                                                                                            
SSO Region [None]: us-east-2                                                                                                                                                                                                                                                                                            
Attempting to automatically open the SSO authorization page in your default browser.
If the browser does not open or you wish to use a different device to authorize this request, open the following URL:

https://device.sso.us-east-2.amazonaws.com/

Then enter the code:
Opening in existing browser session.
The only AWS account available to you is: xxx
Using the account ID xxx
There are 2 roles available to you.
Using the role name "DeveloperAccess"
CLI default client Region [None]:                                                                                                                                                                                                                                                                                       
CLI default output format [None]:              

# Name your profile, for example:                                                                                                                                                                                                                                                                         
CLI profile name:  comp9900                                                                                                                                                                                                                                                     

To use this profile, specify the profile name using --profile, as shown:

aws s3 ls --profile comp9900

```

# Getting programmatic access with Amplify

You'll only need this if you need to do a manual deploy with `amplify push`.

Amplify needs fresh session tokens every 1 hour and this process can be finicky.

https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-profiles.html

TODO(justin): Setup CI/CD so that we don't do manual deployments.

## 1. Edit ~/.aws/config
Edit the file `~/.aws/config`. Add the following profile:

```ini
[profile comp9900]
region=us-east-2
```

## 2. Edit ~/.aws/credentials
Go to: https://d-9a672dba1f.awsapps.com/start and login with your credentials.
* Click your username
* Click on `Commandline or programmatic access`
* Copy option 2 that looks something like
```shell
[comp9900amplify]
aws_access_key_id=xxx
aws_secret_access_key=xxx
aws_session_token=xxx
```

These are temporary tokens that is only valid for 1 hour.

Paste them under `~/.aws/credentials`, making sure it is under the same heading `[comp9900]`
```ini
[comp9900amplify]
aws_access_key_id=xxx
aws_secret_access_key=xxx
aws_session_token=xxx
```

**Note the 1 hour** token timeout. If you can't access `amplify` because of a token issue, get a new token from the SSO login page.
Just copy a new `aws_session_token`

Be sure not to commit any tokens to the repo!