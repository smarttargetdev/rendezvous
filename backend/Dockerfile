FROM php:8.3-cli-alpine

# Install system dependencies & PHP extensions (Swoole, Redis, PDO MySQL)
RUN apk add --no-cache \
    git \
    curl \
    mariadb-connector-c-dev \
    libzip-dev \
    openssl-dev \
    autoconf \
    g++ \
    make \
    linux-headers

RUN docker-php-ext-install pdo pdo_mysql pcntl

# Install Swoole and Redis via PECL
RUN pecl install swoole redis \
    && docker-php-ext-enable swoole redis

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json ./
RUN composer install --no-dev --optimize-autoloader || true

COPY . .

EXPOSE 9501 8000

CMD ["php", "server_swoole.php"]
