#!/usr/bin/env python3
"""
Simple HTTP server for testing the AIUML website locally.
Run this to avoid file:// protocol issues with JavaScript.
"""

import http.server
import socketserver
import os
import webbrowser
from pathlib import Path

# Configuration
PORT = 8000
DIRECTORY = Path(__file__).parent

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Add headers to prevent caching during development
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Expires', '0')
        super().end_headers()

def main():
    os.chdir(DIRECTORY)

    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 AIUML Website Server")
        print(f"📁 Serving from: {DIRECTORY}")
        print(f"🌐 URL: http://localhost:{PORT}")
        print(f"🔄 To reset typewriter: http://localhost:{PORT}?reset=true")
        print(f"⌨️  Press Ctrl+C to stop\n")

        # Open browser automatically
        webbrowser.open(f'http://localhost:{PORT}')

        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n✅ Server stopped")

if __name__ == "__main__":
    main()