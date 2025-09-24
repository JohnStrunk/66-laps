#! /bin/bash

# This script creates a new Markdown file for either an Architectural Decision
# Record (MADR) or a Feature description, using the next available sequential
# ID in the current directory.
#
# Supported types:
#   - Feature: Feature description (option: -f)
#   - MADR: Architectural Decision Record (option: -m)

set -e -o pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

function usage() {
    cat - <<EOF
Usage: new-record.sh {-m | -f} <title>

    -f: Create a new Feature description file.
    -m: Create a new MADR file.
    <title>: The title for the record or feature. Used for the filename and in
    the file content.

The command will create a new file and return the filename as a JSON object:
    {"filename": "<generated-filename>"}

Example:
    ./new-record.sh -m "Use RESTful APIs for communication"
    {"filename": "0001-madr-use-restful-apis-for-communication.md"}

    ./new-record.sh -f "Implement user login"
    {"filename": "0002-feat-implement-user-login.md"}
EOF
}

########################################
# Generate the next available ID for a new record.
#
# Scan existing files in this script's directory, and return the next
# sequential ID as a 4-digit number.
# - The number returned will be greater than any existing ID.
# - The number is zero-padded to ensure it is always 4 digits long.
# - If no existing numbered files are found, it returns "0000".
function get_next_id() {
    local max_id=0
    for file in "$SCRIPT_DIR"/*.md; do
        if [[ -f "$file" ]]; then
            local id
            id=$(basename "$file" | sed -E 's/([0-9]{4}).*/\1/')
            if [[ "$id" =~ ^[0-9]{4}$ ]]; then
                if ((10#$id > max_id)); then
                    max_id=$((10#$id))
                fi
            fi
        fi
    done
    printf "%04d\n" $((max_id + 1))
}

########################################
# Remove articles and limit to 4 words for the filename
function sanitize_title() {
    local title="$1"
    local word_limit=4
    local remove_words=(a an the)
    # Convert to lowercase
    title=$(echo "$title" | tr '[:upper:]' '[:lower:]')
    # Remove specified words
    for word in "${remove_words[@]}"; do
        title=$(echo "$title" | sed -E "s/\\b$word\\b//g")
    done
    title=$(echo "$title" | xargs) # trim
    # Limit to word_limit words
    title=$(echo "$title" | awk -v limit="$word_limit" '{for(i=1;i<=NF&&i<=limit;i++) printf "%s%s", $i, (i<NF&&i<limit?"-":"");}')
    # Remove trailing dash if present
    title="${title%-}"
    echo "$title"
}


########################################
# Create the feature file with template content
function create_feature() {
    local id="$1"
    local title="$2"
    local full_title="$3"
    local filename="${id}-feat-${title}.md"
    local filepath="$SCRIPT_DIR/$filename"
    cat > "$filepath" <<EOF
# $full_title

## Feature Description

{Describe the feature and its purpose.}

## Motivation

{Explain why this feature is needed.}

## Acceptance Criteria

{List the criteria that must be met for this feature to be considered complete.}

## Dependencies

{List any dependencies or related features.}

## Additional Notes

{Any other relevant information.}
EOF
    echo "$filename"
}


########################################
# Create the MADR file with template content
function create_madr() {
    local id="$1"
    local title="$2"
    local full_title="$3"
    local filename="${id}-madr-${title}.md"
    local filepath="$SCRIPT_DIR/$filename"
    cat > "$filepath" <<EOF
# $full_title

## Context and problem statement

{Describe the context and problem statement in free form using two to three
sentences}

## Decision and justification

{Briefly describe the decision made.}

{Provide a more detailed and structured description of the decision and its
justification.}

## Other options considered

{Describe other options that were considered, but not chosen. This should be a
bulleted list of options with a short description of each.}

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted. If other MADRs are referenced, they should be listed here.}
EOF
    echo "$filename"
}


########################################
# Parse options
type=""
while getopts ":fhm" opt; do
    case $opt in
        f)
            type="feature"
            ;;
        h)
            usage
            exit 0
            ;;
        m)
            type="madr"
            ;;
        *)
            usage >&2
            exit 1
            ;;
    esac
done
shift $((OPTIND -1))

if [[ -z "$type" || $# -lt 1 ]]; then
        usage >&2
        exit 1
fi

raw_title="$*"
id=$(get_next_id)
sanitized_title=$(sanitize_title "$raw_title")

case "$type" in
    feature)
        filename=$(create_feature "$id" "$sanitized_title" "$raw_title")
        ;;
    madr)
        filename=$(create_madr "$id" "$sanitized_title" "$raw_title")
        ;;
    *)
        echo "Unknown type: $type" >&2
        exit 1
        ;;
esac

# Output filename as JSON (relative to repo root, dynamic)
echo "{\"filename\": \"$(basename "$SCRIPT_DIR")/$filename\"}"
