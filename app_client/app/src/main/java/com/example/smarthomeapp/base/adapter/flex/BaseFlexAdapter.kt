package com.example.smarthomeapp.base.adapter.flex

import android.view.ViewGroup
import androidx.annotation.CallSuper
import androidx.recyclerview.widget.RecyclerView
import androidx.recyclerview.widget.RecyclerView.AdapterDataObserver
import com.example.smarthomeapp.base.adapter.OnDataChangedListener
import com.example.smarthomeapp.base.holder.Holder
import java.lang.ref.WeakReference

abstract class BaseFlexAdapter<HOLDER : Holder<*>> :
    RecyclerView.Adapter<HOLDER>() {
    private var dataChangedListener: OnDataChangedListener? = null
    private var dataObserver: AdapterDataObserver? = null
    private var recyclerViewWeakRef: WeakReference<RecyclerView>? = null
    fun setDataChangedListener(dataChangedListener: OnDataChangedListener?) {
        this.dataChangedListener = dataChangedListener
        if (dataChangedListener == null) {
            dataObserver?.let {
                unregisterAdapterDataObserver(it)
                dataObserver = null
            }
        } else if (dataObserver == null) {
            initDataObserver()
        }
    }

    private fun initDataObserver() {
        dataObserver = object : AdapterDataObserver() {
            override fun onChanged() {
                super.onChanged()
                dataChangedListener?.run {
                    if (itemCount == 0) {
                        onDataSetEmpty()
                    } else {
                        onDataSetFilled()
                    }
                }
            }

            override fun onItemRangeInserted(
                positionStart: Int,
                itemCount: Int
            ) {
                super.onItemRangeInserted(positionStart, itemCount)
                dataChangedListener?.run {
                    if (itemCount > 0) {
                        onDataSetFilled()
                    } else if (getItemCount() == 0) {
                        onDataSetEmpty()
                    }
                }
            }

            override fun onItemRangeRemoved(
                positionStart: Int,
                itemCount: Int
            ) {
                super.onItemRangeRemoved(positionStart, itemCount)
                dataChangedListener?.run {
                    if (getItemCount() == 0) {
                        onDataSetEmpty()
                    }
                }
            }
        }.also {
            registerAdapterDataObserver(it)
        }
    }

    override fun onAttachedToRecyclerView(recyclerView: RecyclerView) {
        super.onAttachedToRecyclerView(recyclerView)
        if (dataChangedListener != null) {
            if (dataObserver == null) {
                initDataObserver()
            }
        }
    }

    override fun onDetachedFromRecyclerView(recyclerView: RecyclerView) {
        super.onDetachedFromRecyclerView(recyclerView)
        dataObserver?.let {
            unregisterAdapterDataObserver(it)
            dataObserver = null
        }
    }

    final override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): HOLDER {
        return onCreateHolder(parent, viewType).also {
            it.onCreate()
        }
    }

    @CallSuper
    override fun onViewDetachedFromWindow(holder: HOLDER) {
        super.onViewDetachedFromWindow(holder)
        holder.onUnbind()
    }

    override fun onViewRecycled(holder: HOLDER) {
        super.onViewRecycled(holder)
        holder.onClear()
    }

    fun post(action: Runnable) {
        recyclerViewWeakRef?.get()?.post(action)
    }

    abstract fun onCreateHolder(parent: ViewGroup, viewType: Int): HOLDER

    open fun clear() {}

    open fun isSupportedLoadmoreHolder() = false
}
