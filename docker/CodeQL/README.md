
# Based on 
 - https://github.com/codeql-agent-project/codeql-agent-docker
 - https://github.com/microsoft/codeql-container

## Build
```bash
docker build -t codeql-container .
```

## Examples usage
<details>
    <summary>Basic code scanning.</summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  codeql-container
```
</details>

<details>
    <summary>Code scanning with maximum threads available.</summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  -e "THREADS=0" \
  codeql-container
```
  </details>

<details>
    <summary>Create database only.</summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  -e "ACTION=create-database-only" \
  codeql-container
```
  </details>

<details>
    <summary>Specify the queries suite for Java source.</summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  -e "LANGUAGE=java" \
  -e "QS=java-security-and-quality.qls" \
  codeql-container
```
</details>

<details>
    <summary>Change owner of the results folder.</summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  -e "USERID=$(id -u ${USER})" -e "GROUPID=$(id -g ${USER}) \
  codeql-container
```
</details>

<details>
    <summary> Specify the Java version and the build database command </summary>

```bash
docker run --rm --name codeql-docker \
  -v "$PWD:/opt/src" \
  -v "$PWD/codeql-results:/opt/results" \
  -e "LANGUAGE=java" \
  -e "JAVA_VERSION=8" \
  -e "COMMAND=mvn clean install" \
  codeql-container

```
</details>
