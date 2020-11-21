FROM golang:1.14 as builder

# Copy local code to the container image.
WORKDIR /build
COPY . .

# Build the command inside the container.
RUN make install && make build

# Use a Docker multi-stage build to create a lean production image.
# https://docs.docker.com/develop/develop-images/multistage-build/#use-multi-stage-builds
FROM alpine:latest
RUN apk --no-cache add ca-certificates

# Copy the binary to the production image from the builder stage.
WORKDIR /app
COPY config.json config.json
COPY --from=builder /build/bin/github.com/andreiBatinas/deliver-service .

RUN chmod +x deliver-service config.json
EXPOSE 8080 25000

# Run the web service on container startup.
CMD ["/app/deliver-service"]
