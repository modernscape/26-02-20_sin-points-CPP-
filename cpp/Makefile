# コンパイラ指定
CC = emcc

# 出力先（Next.jsのpublicフォルダ）
OUT_DIR = ../public/wasm
OUT_NAME = engine.js

# コンパイルオプション
# -O3: 最大限の最適化
# --bind: embindを使用（C++クラスをJSで扱うため）
CFLAGS = -O3 --bind

# Emscripten固有の設定
# MODULARIZE=1: JS側で Promise ベースの初期化関数にする
# EXPORT_NAME: 初期化関数の名前
# ALLOW_MEMORY_GROWTH=1: メモリが足りない時に自動拡張（流体計算では重要）
EM_FLAGS = -s MODULARIZE=1 
			-s EXPORT_NAME='createEngine' 
			-s ALLOW_MEMORY_GROWTH=1 
			-s EXPORTED_RUNTIME_METHODS='["HEAPF32"]'

# ビルド対象のソースファイル
SRCS = main.cpp

# 実行ルール
all:
	mkdir -p $(OUT_DIR)
	$(CC) $(CFLAGS) $(EM_FLAGS) $(SRCS) -o $(OUT_DIR)/$(OUT_NAME)

clean:
	rm -rf $(OUT_DIR)/engine.js $(OUT_DIR)/engine.wasm