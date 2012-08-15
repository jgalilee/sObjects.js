class CanvasController < ApplicationController
  # GET /canvas
  def index
  end

  # POST /canvas
  def post
    @sr = params[:signed_request]

    # Validate the signed request was provided.
    raise "Signed request parameter required." if @sr.blank?()

    # Retrieve consumer secret from environment
    secret = ENV["CANVAS_CONSUMER_SECRET"]
    raise "No consumer secret found in environment." if secret.blank?()


    # Construct the signed request helper
    srHelper = SignedRequest.new(secret,@sr)

    # Unsign the signed request.
    @canvasRequestJson = srHelper.unsign()

  end

end
