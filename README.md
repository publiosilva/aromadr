# AromaDR

AromaDR is a tool designed to analyze test smells in a language-independent manner, providing insights into improving test quality.

## 🚀 Getting Started

### Prerequisites
Ensure you have [Docker](https://www.docker.com/get-started) installed on your system.

### Build the Docker Image
To build the AromaDR Docker image, run the following command:

```sh
docker build -t aromadr .
```

### Run the Container
Execute the following command to start AromaDR:

```sh
docker run --rm -it -p 3000:3000 -p 8000:8000 aromadr
```

### Access the Application
Once the container is running, open your browser and navigate to:

```
http://localhost:8000
```

## AromaDR API

When the Docker image is running, an API is available on port 3000. You can use the API by making the following requests:

### Detect Test Smells in File

### Parameters:
- **`language`**: The programming language of the repository (`csharp`, `java`, `javascript`, or `python`).
- **`framework`**: The testing framework used (`xunit`, `junit`, `jest`, or `pytest`).
- **`testFileContent`**: The content of the test file to analyze.

### Example:
```
curl --location 'http://localhost:3000/file-test-smells/detect' \
--header 'Content-Type: application/json' \
--data '{
    "language": "csharp",
    "framework": "xunit",
    "testFileContent": "public class MyClassTest { ... }"
}'
```

### Detect Test Smells in Repository

### Parameters:
- **`language`**: The programming language of the repository (`csharp`, `java`, `javascript`, or `python`).
- **`framework`**: The testing framework used (`xunit`, `junit`, `jest`, or `pytest`).
- **`repositoryURL`**: The URL of the public repository to analyze.

### Example:
```
curl --location 'http://localhost:3000/project-test-smells/detect' \
--header 'Content-Type: application/json' \
--data '{
    "language": "csharp",
    "framework": "xunit",
    "repositoryURL": "https://github.com/public/repository/url"
}'
```

## 🤝 Contributing
We welcome contributions! Feel free to submit issues or pull requests.

## 📬 Contact
For questions or support, please reach out via [GitHub Issues](https://github.com/publiosilva/aromadr/issues).
