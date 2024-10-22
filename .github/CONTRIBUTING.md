# Contributing

**The issue tracker is only for bug reports and enhancement suggestions. If you have a question, please ask it in the [Discord server][discord server] instead of opening an issue – you will get redirected there anyway.**

If you wish to contribute to the codebase, feel free to fork the repository and submit a
pull request. We use ESLint to enforce a consistent coding style, so having that set up in your editor of choice
is a great boon to your development process.

## Setup

To get ready to work on the codebase, please do the following:

1. Fork & clone the repository, and make sure you're on the **main** branch
2. Run `yarn --immutable` to install packages.
3. Create a new branch and make your changes. [^env]
4. Make sure you use a proper linter. [^lint]
5. Make sure you have a good commit message.[^commit]
6. Push your changes.
7. Submit a pull request [here][pr].

<!-- REFERENCES -->

[^env]: You will need to create a `.env` file in the root directory of the project.

[^lint]: We recommend using [`eslint`][eslint] to lint your code.

[^commit]: We strongly follow the [Commit Message Conventions][commit message conventions]. This is important when commiting your code for a PR.

<!-- LINKS -->

[pr]: https://github.com/Rygent/Elvia/pulls
[eslint]: https://eslint.org/
[commit message conventions]: https://conventionalcommits.org/en/v1.0.0/
[discord server]: https://discord.gg/FD5MMabf8Y
