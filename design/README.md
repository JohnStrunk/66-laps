# Design and decision records

This directory contains design documents and decision records that outline the
architecture and key decisions made during the development of this project.
These documents serve as a reference for understanding the rationale behind
various design choices and provide context for future development.

## Creating new records

To create a new design or decision record, use the `new-record.sh` script
provided in this directory. This script generates a new markdown file with a
standardized template for documenting the record.

### Usage

```text
Usage: ./new-record.sh {-f | -m} <title>

  -f: Create a new Feature description file.
  -m: Create a new MADR file.
  <title>: The title for the record or feature. Used for the filename and in
    the file content.
```

The command will create a new file and return the filename as a JSON object:

```json
{"filename": "<generated-filename>"}
```

Examples:

```console
$ ./new-record.sh -m "Use RESTful APIs for communication"
{"filename": "0001-madr-use-restful-apis-for-communication.md"}

$ ./new-record.sh -f "Implement user login"
{"filename": "0002-feat-implement-user-login.md"}
```
