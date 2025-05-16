FROM busybox:latest
RUN --mount=type=cache,target=./cached,sharing=locked \
  echo "Hello, world!" > ./cached/hello.txt

