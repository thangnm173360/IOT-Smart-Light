package com.example.smarthomeapp.base.holder

import android.view.View
import androidx.annotation.CallSuper
import androidx.recyclerview.widget.RecyclerView
import com.example.smarthomeapp.base.adapter.OnItemClick

open class Holder<MODEL>(view: View) : RecyclerView.ViewHolder(view) {

    protected var model: MODEL? = null
        private set

    open fun onCreate() {}

    @CallSuper
    open fun onBind(position: Int, model: MODEL?) {
        this.model = model
    }

    open fun onUnbind() {}

    open fun onClear() {}

    fun registerRootViewItemClickEvent(onRecyclerViewItemClick: OnItemClick<MODEL>?) {
        itemView.setOnClickListener(
            onRecyclerViewItemClick?.let { DelegateOnClick(it) }
        )
    }

    protected fun registerChildViewItemClickEvent(
        view: View,
        onRecyclerViewItemClick: OnItemClick<MODEL>?,
    ) {
        itemView.setOnClickListener(null)
        view.setOnClickListener(
            onRecyclerViewItemClick?.let { DelegateOnClick(it) }
        )
    }

    protected fun registerChildViewClickEvent(
        view: View,
        onRecyclerViewItemClick: OnItemClick<MODEL>?,
    ) {
        view.setOnClickListener(
            onRecyclerViewItemClick?.let { DelegateOnClick(it) }
        )
    }

    protected inner class DelegateOnClick(private val delegate: OnItemClick<MODEL>) :
        View.OnClickListener {
        override fun onClick(v: View?) {
            delegate.onItemClick(layoutPosition, v, model)
        }
    }
}