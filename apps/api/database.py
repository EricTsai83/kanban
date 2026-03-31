from __future__ import annotations

import os
import ssl as _ssl
from collections.abc import AsyncGenerator
from urllib.parse import parse_qs, urlencode, urlparse, urlunparse

from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

load_dotenv()

_url = os.environ.get("DATABASE_URL", "")
if not _url:
    raise RuntimeError(
        "DATABASE_URL is not set. Add it to apps/api/.env or the environment."
    )


_LIBPQ_ONLY_PARAMS = {"channel_binding", "sslmode"}


def _make_asyncpg_url(url: str) -> tuple[str, dict]:
    """Convert a postgresql:// URL to one asyncpg accepts.

    Returns (url, connect_args) — libpq-only query params are stripped
    and SSL is passed via connect_args when sslmode was present.
    """
    parsed = urlparse(url)
    params = parse_qs(parsed.query, keep_blank_values=True)
    needs_ssl = "sslmode" in params and params["sslmode"][0] in ("require", "verify-ca", "verify-full")
    for key in _LIBPQ_ONLY_PARAMS:
        params.pop(key, None)
    new_query = urlencode({k: v[0] for k, v in params.items()})
    new_parsed = parsed._replace(scheme="postgresql+asyncpg", query=new_query)
    if needs_ssl:
        ctx = _ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = _ssl.CERT_NONE
        connect_args = {"ssl": ctx}
    else:
        connect_args = {}
    return urlunparse(new_parsed), connect_args


_async_url, _connect_args = _make_asyncpg_url(_url)

engine = create_async_engine(_async_url, pool_pre_ping=True, connect_args=_connect_args)

_SessionFactory = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with _SessionFactory() as session:
        async with session.begin():
            yield session
