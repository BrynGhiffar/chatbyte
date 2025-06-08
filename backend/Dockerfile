FROM rust:1.87-alpine as builder

WORKDIR /app/src/chatbyte-be
RUN USER=root

RUN apk update
RUN apk add build-base openssl-dev musl-dev openssl-libs-static --no-cache

COPY Cargo.toml Cargo.lock ./

RUN mkdir -p src && \
	echo "fn main() { }" > src/main.rs && \
	cargo build --release --target x86_64-unknown-linux-musl

RUN rm src/main.rs
COPY . .
RUN touch -a -m src/main.rs
RUN cargo build --release --locked --target x86_64-unknown-linux-musl

FROM alpine:latest

WORKDIR /app
RUN apk update

COPY --from=builder /app/src/chatbyte-be/src/assets/empty-profile.jpg /app
COPY --from=builder /app/src/chatbyte-be/target/x86_64-unknown-linux-musl/release/chatbyte-be /app

CMD [ "./chatbyte-be" ]
