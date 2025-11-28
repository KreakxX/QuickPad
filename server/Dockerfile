FROM golang:1.25.3-alpine AS build
WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o server .

FROM alpine
WORKDIR /app
COPY --from=build /app/server .
EXPOSE 8080
CMD ["./server"]
