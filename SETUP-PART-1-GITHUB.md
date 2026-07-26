# Part 1 — Getting your site live on GitHub Pages

You don't need to install anything on your computer for this part. No Node, no git, no terminal. Everything happens in the browser. By the end of this document your site will be live at a real URL you can send to someone.

## First, what these words actually mean

**Git** is a system for tracking changes to a folder of files over time. Every time you save a meaningful change, git records a snapshot. That snapshot is called a **commit**. A commit isn't a backup of one file — it's a photograph of the entire folder at that moment, plus a note from you saying what changed. The point is that you can always look back at any photograph, compare two of them, or roll the whole folder back to how it was three weeks ago. This is why developers stop being afraid of breaking things.

**GitHub** is a website that hosts git repositories in the cloud. A **repository** — repo — is just that tracked folder, living on GitHub's servers where you can reach it from anywhere and other people can see it. Git and GitHub are separate things that get talked about as one: git is the tool, GitHub is the place. You can use git with no GitHub at all, and for the first part of this you'll use GitHub with no git at all, because GitHub's website will do the git parts for you.

A **branch** is a parallel line of commits. Your repo starts with one branch called `main`, and for a solo portfolio site that's the only branch you'll ever need. Branches matter on teams, where two people need to work on different features without stepping on each other, and for you later when you want to try a risky redesign without touching the live site.

**GitHub Pages** is a free service where GitHub takes files from your repo and serves them as a real website. It's the reason this whole thing costs nothing. The catch is that Pages serves *static* files — HTML, CSS, JavaScript, images — and your project isn't in that form yet. It's React and TypeScript source code, which browsers can't read directly. Something has to translate it. That something is the **build step**, and the tool that does it is Vite, which reads your `src/` folder and spits out a `dist/` folder of plain HTML/CSS/JS.

Which raises the obvious question: who runs the build if it isn't you? That's **GitHub Actions**. It's a robot that lives in your repo and runs commands on GitHub's own servers whenever something happens — in your case, whenever you push a commit to `main`. There's already a file in your project at `.github/workflows/deploy.yml` that tells that robot: install the dependencies, run the build, take the `dist` folder, hand it to Pages. So your loop becomes: change a file → Actions builds it → Pages serves it. You never build anything locally unless you want to preview.

## Step 1 — Make a GitHub account

Go to github.com and sign up. The username matters more than you'd expect, because it becomes part of your site's URL and it shows up on anything you ever publish. Recruiters will see it. Use something close to your name — `rimsha-ahmed`, `rimshaahmed`, `rahmed` — not a handle from a game.

Pick the free plan. Everything here works on free.

## Step 2 — Create the repository

Once you're logged in, click the **+** in the top right and choose **New repository**.

Name it exactly this, substituting your username:

```
yourusername.github.io
```

So if your username is `rimsha-ahmed`, the repo is named `rimsha-ahmed.github.io`. This exact naming is a GitHub convention and it's worth following: a repo named this way gets served at the root of your domain, `https://rimsha-ahmed.github.io/`, rather than at a subpath like `/portfolio/`. That matters because your project's config file expects to live at a root, and because when you attach your real domain in Part 2 nothing has to change.

Set it to **Public**. Pages requires public on the free plan, and a public portfolio repo is a feature anyway — "source on GitHub" in your footer is something hiring managers actually click.

Leave **Add a README**, **Add .gitignore**, and **Choose a license** all unchecked. Your project already contains those files and starting an empty repo avoids a conflict on the first upload.

Click **Create repository**. You'll land on a mostly-empty page with setup instructions. Ignore all of it — those are the terminal instructions and you're taking the browser route.

## Step 3 — Upload the project

Unzip `portfolio.zip` somewhere you can find it. Open the folder. You should see `src`, `public`, `.github`, `index.html`, `package.json`, and a handful of config files.

On the empty repo page, find the link that says **uploading an existing file**. It's in the sentence "…or push an existing repository from the command line" area, near the top. Click it.

Now the important part, because there's a trap here. Do **not** drag the `portfolio` folder itself into the browser. Open it, select everything *inside* it, and drag that. GitHub needs `index.html` and `package.json` sitting at the top level of the repo, not nested one folder deep. If they end up nested the build will fail with a confusing error about a missing package.json.

Select all with Ctrl+A (Cmd+A on Mac) inside the folder, then drag the selection onto the upload area.

Two things to watch:

Hidden folders don't always come along. The `.github` folder starts with a dot, which makes it invisible in Windows Explorer and macOS Finder by default, and if it doesn't upload, nothing will ever build. On Windows: File Explorer → View tab → check **Hidden items**. On Mac: press Cmd+Shift+Period in Finder. Then confirm `.github` is in your selection.

`node_modules` should not be there — it isn't in the zip, and it shouldn't be. It's a folder of downloaded dependency code, tens of thousands of files, and it gets rebuilt from `package.json` on every machine that needs it. Committing it is a classic beginner mistake and it makes repos enormous.

Once the files finish staging, scroll down. There's a box for a **commit message** — that's the note attached to this snapshot. Write something real: `Initial portfolio site`. Leave "Commit directly to the main branch" selected. Click **Commit changes**.

You just made your first commit.

## Step 4 — Turn on Pages

In your repo, click **Settings** (the tab across the top of the repo, not your account settings), then **Pages** in the left sidebar.

Under **Build and deployment**, there's a dropdown labeled **Source**. It probably says "Deploy from a branch." Change it to **GitHub Actions**.

This is the single most-missed step, so it's worth understanding rather than just clicking. "Deploy from a branch" means GitHub takes files from your repo exactly as they are and serves them — which for a React project means serving raw TypeScript that no browser can read, and you get a blank white page. "GitHub Actions" means GitHub instead runs your `deploy.yml` workflow, which builds first and serves the built output. You need the second one.

There's no save button; the dropdown saves itself.

## Step 5 — Watch it build

Click the **Actions** tab at the top of your repo.

You should see a run named after your commit message, with a spinning yellow dot. Click into it, then click the job name, and you'll see the steps expand as they run: checking out your code, setting up Node, `npm ci` to install dependencies, `npm run build`, then upload and deploy. The whole thing takes one to two minutes, most of it dependency installation.

Yellow dot means running. Green check means done. Red X means something broke.

If you get a red X, click into the failed step and read the last twenty or so lines — that's where the actual error is. The two failures you're most likely to hit: `npm ci` complaining it can't find package.json means you uploaded the folder instead of its contents, and the fix is to re-upload correctly. A TypeScript error means a file got mangled in transit, and the message names the exact file and line. Paste the error to me and I'll tell you what it is.

Once it's green, go back to Settings → Pages. Your URL is at the top: `https://yourusername.github.io/`. Open it.

Give it a minute if it 404s on the first try — the first deploy sometimes takes a couple of minutes to propagate after Actions reports success.

## Step 6 — Make a change, so the loop is real

Understanding this cycle is more valuable than any single step above, so do it once deliberately.

In your repo, click into `src/sections/Hero.tsx`. Click the pencil icon in the top right of the file view. Find the tagline text near the bottom and change a word. Scroll down, write a commit message like `Tweak tagline`, and commit.

Now go to Actions. A new run started on its own, because your `deploy.yml` says "run on every push to main." Wait for green, refresh your live site, and your change is there.

That's the entire workflow, forever. Edit, commit, wait ~90 seconds, refresh. Whether you edit in the browser like you just did or on your own machine later, the second half never changes.

## What to change first

The content is real but a few things need your eyes.

The contact email currently reads `rimshaa314@gmail.com`, in `src/sections/Contact.tsx`. You've been writing to me from `contactrimsha.ahmed@gmail.com`. Decide which one you want recruiters using and make it consistent with what's on your resume.

Every project image in `public/projects/` is a placeholder SVG stamped **SAMPLE DATA — REPLACE**. That stamp is deliberate — it's a tripwire so a real dashboard screenshot never sneaks onto a public page by accident. Replacing them is the sample-data rebuild we talked about: rebuild one or two Power BI dashboards on synthetic numbers, screenshot those, and swap the files. Keep the same filenames and nothing else needs to change. Real SM Beauty revenue, account names, and backorder data stay off this site — it's public with no access control, and there is no version of that risk worth taking.

Your resume PDF is at `public/Rimsha_Ahmed_Resume.pdf` and the Contact section links to it. It still has the placeholder phone number in it, so regenerate it once you've filled that in.

---

When the site is live and you've got the URL, tell me and we'll do Part 2 — pointing your Namecheap domain at it, which is four DNS records and one file.
