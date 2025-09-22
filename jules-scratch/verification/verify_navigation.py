from playwright.sync_api import sync_playwright, Page, expect
import time

def test_navigation(page: Page):
    """
    This test verifies the navigation menu on desktop and mobile.
    """
    # 1. Arrange: Go to the website
    page.goto("http://0.0.0.0:8000")

    # 2. Assert: Check desktop navigation is visible
    expect(page.locator(".nav-menu")).to_be_visible()
    expect(page.locator(".nav-buttons")).to_be_visible()
    expect(page.locator(".hamburger")).not_to_be_visible()

    # 3. Act: Switch to mobile viewport
    page.set_viewport_size({"width": 375, "height": 667})

    # 4. Assert: Check hamburger menu is visible on mobile
    expect(page.locator(".hamburger")).to_be_visible()
    expect(page.locator(".nav-buttons")).not_to_be_visible()

    # 5. Act: Click the hamburger menu
    page.locator(".hamburger").click()

    # Add a small delay
    time.sleep(1)

    # Print page content for debugging
    print(page.content())

    # 6. Assert: Check if the mobile navigation menu is visible
    expect(page.locator(".nav-menu.active")).to_be_visible()

    # 7. Screenshot: Capture the final result for visual verification.
    page.screenshot(path="jules-scratch/verification/navigation_test.png")

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    test_navigation(page)
    browser.close()
