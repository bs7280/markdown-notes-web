# Markdown Notes Web Service

This is a simple webservice to view, search, and edit your own markdown notes stored in github. This is originally designed to work with my obsidian note collection, but it should work on any collection of markdown notes.

This project is in a very WIP POC State, and is currently just a side project + a way to learn Next.JS. If this gets any traction, I have a lot of feature ideas, but for now this is meant to be simple, hacky, and free to setup.

## Setup

Below are instructions on how deploy this to a free [Vercel](https://vercel.com/) account to privately view and edit your notes.

### Step 0

Your markdown notes must already be in github **In a seperate repo** . I use obsidian with the obsidian-git plugin to sync my notes from the obsidian desktop app to github.

This service will need to read and write to your note repo, which will require a Personal Access Token. If you are using obsidian-git you can reuse the same token, but I would recommend creating a new one

At the end of this you should have TWO repos:

1. your note vault repo - where all the actual note content is saved
2. a fork of this repo

### Step 1 - Fork this repo

If you want to easily get future updates to this project, fork this project into your own github project.

> [!NOTE]
>
> The reason for forking this project instead of using it directly -- vercel will clone a public repo into your account which makes it hard to get updates in the future.

## Step 2 - Create a personal access token

[Create a Personal Access Token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens#creating-a-fine-grained-personal-access-token) for your **Note Vault Repo** with

- Read/Write access to content
- Read access to meta data

### Step 2

1. Create a new account on Vercel if you don't already have one, and connect your github account.
2. `Add New > Project`
3. Use `import git repository > markdown-notes-web`
4. Add the following env variables (with your own values)

   ```
   GITHUB_TOKEN=github_pat_... # Secret value, keep this in a password manager
   GITHUB_OWNER=<YOUR_GITHUB_USERNAME>
   GITHUB_REPO=<YOUR MARKDOWN NOTE REPO NAME> # ex: note-vault
   GITHUB_BRANCH=your_branch_name # your branch name ex: main
   BASIC_AUTH_USER=myusername
   BASIC_AUTH_PASSWORD=my-super-strong-password

   ```

5. Hit deploy
