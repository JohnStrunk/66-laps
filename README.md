# 66-laps

... because counting laps is hard, especially when there are 10 lanes.

## Description

66-laps is a web application designed to help starters practice counting laps
efficiently for distance events. The application supports multiple lane
configurations (6-10 lanes) and race lengths (500/1000/1650 SC and 800/1500
LC).

## Development Instructions

### Prerequisites

This project is designed to be developed within the provided devcontainer.
Ensure you have Docker and Visual Studio Code installed with the [Dev
Containers
extension](https://marketplace.visualstudio.com/items/?itemName=ms-vscode-remote.remote-containers).

### Setup

1. Open the repository in Visual Studio Code, either by cloning locally and
   re-opening in the devcontainer, or (recommended) clone the project directly
   into the devcontainer.
1. Start the development server:

   ```console
   yarn dev
   ```

1. Open your browser and navigate to `http://localhost:3000` to view the
   application.

### Storybook

To edit and test components using Storybook, run:

```console
yarn storybook
```

### Testing

Run the test suite using:

```console
yarn test
```

## License

This project is licensed under the AGPL-3.0 or later License - see the
[LICENSE](LICENSE) file for details.
