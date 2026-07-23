package com.example

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.WebChromeClient
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme

class MainActivity : ComponentActivity() {
  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    enableEdgeToEdge()
    setContent {
      MyApplicationTheme {
        Scaffold(modifier = Modifier.fillMaxSize()) { innerPadding ->
          PestControlWebScreen(modifier = Modifier.padding(innerPadding))
        }
      }
    }
  }
}

@Composable
fun PestControlWebScreen(modifier: Modifier = Modifier) {
  AndroidView(
    modifier = modifier.fillMaxSize(),
    factory = { context ->
      WebView(context).apply {
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.allowFileAccess = true
        settings.mixedContentMode = WebSettings.MIXED_CONTENT_COMPATIBILITY_MODE
        webChromeClient = WebChromeClient()
        webViewClient = object : WebViewClient() {
          override fun shouldOverrideUrlLoading(view: WebView?, url: String?): Boolean {
            if (url == null) return false
            if (url.startsWith("http://") || url.startsWith("https://")) {
              if (url.contains("wa.me") || url.contains("whatsapp.com")) {
                try {
                  val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                  context.startActivity(intent)
                  return true
                } catch (e: Exception) {
                  // Fallback to loading URL in WebView if app not available
                }
              }
              return false
            } else if (url.startsWith("tel:") || url.startsWith("mailto:") || url.startsWith("intent:")) {
              try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                context.startActivity(intent)
                return true
              } catch (e: Exception) {
                return true
              }
            }
            return false
          }
        }
        loadUrl("file:///android_asset/index.html")
      }
    }
  )
}

@Composable
fun Greeting(name: String, modifier: Modifier = Modifier) {
  PestControlWebScreen(modifier = modifier)
}

