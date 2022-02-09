package com.example.smarthomeapp.util.loadmore

import androidx.recyclerview.widget.StaggeredGridLayoutManager
import com.example.smarthomeapp.util.loadmore.HeadItemListener.IFirstVisibleItemFinder
import com.example.smarthomeapp.util.loadmore.LastItemListener.ILastVisibleItemFinder

internal class StaggedVisibleItemFinder(private val staggeredGridLayoutManager: StaggeredGridLayoutManager) :
    ILastVisibleItemFinder, IFirstVisibleItemFinder {
    private fun getLastVisibleItem(lastVisibleItemPositions: IntArray): Int {
        return lastVisibleItemPositions.maxOrNull() ?: 0
    }

    private fun getFirstVisibleItem(lastVisibleItemPositions: IntArray): Int {
        return lastVisibleItemPositions.minOrNull() ?: 0
    }

    override fun findLastVisibleItemPosition(): Int {
        val lastVisibleItemPositions =
            staggeredGridLayoutManager.findLastVisibleItemPositions(null)
        // get maximum element within the list
        return getLastVisibleItem(lastVisibleItemPositions)
    }

    override fun findFirstVisibleItemPosition(): Int {
        val firstVisibleItemPositions =
            staggeredGridLayoutManager.findFirstVisibleItemPositions(null)
        return getFirstVisibleItem(firstVisibleItemPositions)
    }

}