#!/bin/bash

FILE_HASH=$1

if [ -z "$FILE_HASH" ]; then
    echo "File hash not provided."
    exit 1
fi

# List of supported languages and their extensions
declare -A language_extensions
language_extensions[python]=".py"
language_extensions[javascript]=".js .jsx"
language_extensions[cpp]=".cpp .hpp .cxx .hxx .cc .hh"
language_extensions[csharp]=".cs"
language_extensions[java]=".java"
language_extensions[go]=".go"
language_extensions[typescript]=".ts .tsx"
language_extensions[c]=".c .h"

# Function for defining the programming language
determine_language() {
    local src_dir=$1
    declare -A file_count

    # Count the files for each language
    for lang in "${!language_extensions[@]}"; do
        for ext in ${language_extensions[$lang]}; do
            count=$(find "$src_dir" -type f -name "*$ext" | wc -l)
            ((file_count[$lang]+=$count))
        done
    done

    # Identify the language with the largest number of files
    local max_count=0
    local detected_lang=""
    for lang in "${!file_count[@]}"; do
        if (( file_count[$lang] > max_count )); then
            max_count=${file_count[$lang]}
            detected_lang=$lang
        fi
    done

    if [[ -z $detected_lang ]]; then
        echo "Programming language could not be determined"
        return 1
    else
        echo $detected_lang
    fi
}

print_green() {
    echo -e "${GREEN}${1}${RESET}"
}

print_red() {
    echo -e "${RED}${1}${RESET}"
}

SRC="/opt/src/$FILE_HASH"
OUTPUT=$SRC
RED="\033[31m"
YELLOW="\033[33m"
GREEN="\033[32m"
RESET="\033[0m"

if [ ! -d "$SRC" ]; then
    print_red "[Error]: ${SRC} not found. Can not continue."
    exit 3
fi

# Define the programming language
LANGUAGE=$(determine_language "$SRC")
if [[ $? -ne 0 ]]; then
    print_red "[!] Can not auto detect language. Please check the source code."
    exit 4
fi

# Set options
LANGUAGE=${LANGUAGE,,}
if [[ "$LANGUAGE" == "python" || "$LANGUAGE" == "javascript" || "$LANGUAGE" == "cpp" || "$LANGUAGE" == "csharp" || "$LANGUAGE" == "java" || "$LANGUAGE" == "go" || "$LANGUAGE" == "typescript" || "$LANGUAGE" == "c" ]]
then
    if [[ "$LANGUAGE" == "typescript" ]]
    then
        LANGUAGE="javascript"
    fi
    if [[ "$LANGUAGE" == "c" ]]
    then
        LANGUAGE="cpp"
    fi

else
        echo "[!] Invalid language: $LANGUAGE"
        finalize
        exit 5
fi

if [ -z $FORMAT ]
then
    FORMAT="sarif-latest"
fi

if [ -z $QS ]
then
    QS="$LANGUAGE-security-extended.qls"
fi

if [ -z $OUTPUT ]
then
    OUTPUT="/opt/results"
fi

if [ -z $THREADS ]
then
    THREADS="0"
fi



DB="$OUTPUT/codeql-db"

# Set THREADS

# Show execution information
echo "----------------"
print_green " [+] Language: $LANGUAGE"
print_green " [+] Query-suites: $QS"
print_green " [+] Database: $DB"
print_green " [+] Source: $SRC"
print_green " [+] Output: $OUTPUT"
print_green " [+] Format: $FORMAT"
echo "----------------"

# Switch to Java 8
if [[ $JAVA_VERSION ]]
then
    if [[ $JAVA_VERSION == "8" ]]; then
        update-java-alternatives -s $(update-java-alternatives -l | grep 8 | cut -d " " -f1) || echo '.'
    elif [[ $JAVA_VERSION == "11" ]]; then
        update-java-alternatives -s $(update-java-alternatives -l | grep 11 | cut -d " " -f1) || echo '.'
    else
        echo "[Warning] : JAVA_VERSION must be 8 or 11."
    fi
fi

# Check action
if [ -z $ACTION ]
then
    ACTION='all'
fi

# Functions
create_database() {
    if [[ $COMMAND ]]
    then
        print_green "[Running] Creating DB: codeql database create --threads=$THREADS --language=$LANGUAGE --command=\"$COMMAND\" $DB -s $SRC $OVERWRITE_FLAG"
        codeql database create --threads=$THREADS --language=$LANGUAGE --command="$COMMAND" $DB -s $SRC $OVERWRITE_FLAG
    else
        print_green "[Running] Creating DB: codeql database create --threads=$THREADS --language=$LANGUAGE $DB -s $SRC $OVERWRITE_FLAG"
        codeql database create --threads=$THREADS --language=$LANGUAGE $DB -s $SRC $OVERWRITE_FLAG
    fi
    if [[ $? -ne 0 && $? -ne 2 ]]; then # ignore unempty database
        print_red "[Error]: Codeql create database failed."
        finalize
        exit 6
    fi
}

scan() {
    print_green "[Running] Start Scanning: codeql database analyze --format=$FORMAT --threads=$THREADS $SAVE_CACHE_FLAG --output=$OUTPUT/issues.$FORMAT $DB $QS"
    codeql database analyze --format=$FORMAT --threads=$THREADS $SAVE_CACHE_FLAG --output=$OUTPUT/issues.$FORMAT $DB $QS
    if [ $? -ne 0 ]; then
        print_red "[!] CodeQL analyze failed."
        finalize
        exit 7
    fi
}

convert_sarif_to_sast() {
    print_green "[Running] Convert SARIF to SAST: python3 /root/scripts/sarif2sast.py $OUTPUT/issues.$FORMAT -o $OUTPUT/gl-sast-report.json"
    python3 /root/scripts/sarif2sast.py $OUTPUT/issues.$FORMAT -o $OUTPUT/gl-sast-report.json
    if [[ "$FORMAT" == "sarif"* ]]; then
        mv $OUTPUT/issues.$FORMAT $OUTPUT/issues.sarif
        python3 /root/scripts/fix-sarifviewer-schema-mismatch.py $OUTPUT/issues.sarif
    fi
}

finalize() {
    if [[ $USERID && $GROUPID ]]
    then
        chown -R $USERID:$GROUPID $OUTPUT
        chown -R $USERID:$GROUPID $SRC
    fi
}

main() {
    if [ "$ACTION" == 'create-database-only' ]; then
        create_database
    else
        create_database
        scan
        convert_sarif_to_sast
    fi
    finalize
    echo "[Complete]"
}

main

