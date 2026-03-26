#!/bin/sh

# scripts/test.sh - Consolidate testing logic for 66-laps.
# Exit immediately if a command fails
set -e

# Default values
PORT=3000
STATIC=false
USE_EXISTING=false
PROFILE=false
SERVER_PID=""

# Help/Usage information
usage() {
    cat <<EOF
Usage: $0 [options] [-- [cucumber-js arguments]]

Options:
  -s, --static         Run tests against a static build (Next.js build + serve).
  -e, --use-existing   Assume a server is already running on the target port.
  -p, --port PORT      Specify the port to use (default: 3000).
  -r, --profile        Enable test profiling (generates a timing summary).
  -h, --help           Show this help message.

Cucumber-JS arguments:
  Any additional arguments (like feature file paths, globs, or tags)
  MUST be preceded by '--'.
  Defaults to '--parallel 2' if no arguments are provided.

Examples:
  $0                   Run all dev tests.
  $0 -s                Run all static tests.
  $0 -e -- features/0001-setup-verification.feature
                       Run specific test against a running dev server.
  $0 -p 3001           Run tests on port 3001.
EOF
}

# Parse arguments
while [ "$#" -gt 0 ]; do
    case "$1" in
        -s|--static)
            STATIC=true
            shift
            ;;
        -e|--use-existing)
            USE_EXISTING=true
            shift
            ;;
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        -r|--profile)
            PROFILE=true
            shift
            ;;
        -h|--help)
            usage
            exit 0
            ;;
        --) # End of options, everything else is for cucumber
            shift
            # At this point, positional parameters ($1, $2, ...) are for cucumber
            break
            ;;
        -*) # Unknown option
            echo "Error: Unknown option $1" >&2
            usage >&2
            exit 1
            ;;
        *) # Positional arguments without --
            echo "Error: Unexpected argument '$1'. Use '--' to pass arguments to cucumber-js." >&2
            usage >&2
            exit 1
            ;;
    esac
done

# Set default test arguments if none provided
if [ "$#" -eq 0 ]; then
    set -- --parallel 2
fi

# Cleanup function for background server
cleanup() {
    if [ -n "$SERVER_PID" ]; then
        echo "Stopping background server (PID: $SERVER_PID) on port $PORT..."
        # Try graceful shutdown
        kill "$SERVER_PID" 2>/dev/null || true
        # Also ensure nothing is left on the port if we started it
        if command -v fuser >/dev/null 2>&1; then
            fuser -k "$PORT/tcp" >/dev/null 2>&1 || true
        fi
    fi
}
trap cleanup EXIT INT TERM

# Check if port is in use
PORT_IN_USE=false
if curl -s --connect-timeout 1 127.0.0.1:"$PORT" >/dev/null 2>&1; then
    PORT_IN_USE=true
fi

# Validate server state vs USE_EXISTING
if $USE_EXISTING; then
    if ! $PORT_IN_USE; then
        echo "Error: --use-existing specified, but no server found on port $PORT." >&2
        exit 1
    fi
    echo "Using existing server on port $PORT..."
else
    if $PORT_IN_USE; then
        echo "Error: Port $PORT is already in use. Use -e or --use-existing if you intended to use a running server." >&2
        exit 1
    fi

    # Start the server
    if $STATIC; then
        echo "Building static export..."
        yarn build
        echo "Starting static server on port $PORT..."
        yarn dlx serve out -p "$PORT" > /dev/null 2>&1 &
        SERVER_PID=$!
    else
        echo "Starting dev server on port $PORT..."
        yarn dev -p "$PORT" > /dev/null 2>&1 &
        SERVER_PID=$!
    fi

    # Wait for server to be ready (timeout after 60 seconds)
    echo "Waiting for server to be ready on port $PORT..."
    COUNT=0
    while ! curl -s 127.0.0.1:"$PORT" >/dev/null 2>&1; do
        sleep 1
        COUNT=$((COUNT + 1))
        if [ "$COUNT" -ge 60 ]; then
            echo "Error: Server failed to start on port $PORT within 60 seconds." >&2
            exit 1
        fi
    done
    echo "Server is ready."
fi

# Run tests
echo "Preparing coverage directory..."
yarn coverage:clean

# If profiling is enabled, add the JSON formatter to the arguments
if [ "$PROFILE" = true ]; then
    mkdir -p test-results
    set -- "$@" --format json:test-results/results.json
fi

echo "Executing tests with arguments: $*"
BASE_URL="http://localhost:$PORT" \
NODE_OPTIONS="--import tsx" \
./node_modules/.bin/cucumber-js "$@"

if [ "$PROFILE" = true ]; then
    echo "Tests successful. Generating profile summary..."
    NODE_OPTIONS="--import tsx" \
    tsx scripts/profile-summary.ts
fi

echo "Tests successful. Generating coverage report..."
yarn coverage:report

# The trap on EXIT will handle cleanup()
