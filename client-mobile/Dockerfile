FROM ubuntu:22.04

ENV DEBIAN_FRONTEND=noninteractive

# 1. Install Java 17 (Required for Android Gradle Plugin 8.0+)
RUN apt-get update && apt-get install -y \
    openjdk-17-jdk \
    wget \
    unzip \
    git \
    && rm -rf /var/lib/apt/lists/*

# 2. Setup Android SDK Environment Variables
ENV JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=${PATH}:${ANDROID_HOME}/cmdline-tools/latest/bin:${ANDROID_HOME}/platform-tools

# 3. Download Android Command Line Tools
# Version: 11076708 (latest stable as of late 2023/early 2024)
RUN mkdir -p ${ANDROID_HOME}/cmdline-tools && \
    wget -q https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip -O android_tools.zip && \
    unzip -q android_tools.zip -d ${ANDROID_HOME}/cmdline-tools && \
    mv ${ANDROID_HOME}/cmdline-tools/cmdline-tools ${ANDROID_HOME}/cmdline-tools/latest && \
    rm android_tools.zip

# 4. Accept Licenses and Install SDK Components
# Matches compileSdk 34 from app/build.gradle.kts
RUN yes | sdkmanager --licenses && \
    sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /app

# 5. Copy project files
# We copy specific files first to leverage caching if dependencies haven't changed
COPY build.gradle.kts settings.gradle.kts gradle.properties ./
COPY gradle ./gradle
COPY gradlew ./

# Grant execution permission
RUN chmod +x gradlew

# Download dependencies (Dry run)
# We accept failure here because some subprojects might need source code to configure
RUN ./gradlew dependencies --no-daemon || true

# Copy source code
COPY . .

# Remove local configuration that might conflict with container environment
RUN rm -f local.properties

# 6. Build Command
# Assembles the debug APK
CMD ["./gradlew", "assembleDebug"]
