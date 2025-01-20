package io.sticky.stickyme.RNModule

data class ResponseEscapeCheck(
    val txid: String,
    val code: String,
    val message: String,
    val description: String,
    val timestamp: Long,
    val data: Any?,
)